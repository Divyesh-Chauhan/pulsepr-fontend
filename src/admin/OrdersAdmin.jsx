import { useState, useEffect } from 'react'
import { adminGetOrders, adminUpdateOrderStatus, adminGetAllDesigns, adminUpdateDesignStatus } from '../api/services'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { HiChevronDown, HiChevronUp } from 'react-icons/hi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
function getImageUrl(url) {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
}

const STATUS_OPTIONS_ORDER = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled']
const STATUS_OPTIONS_DESIGN = ['Pending', 'Reviewed', 'InProduction', 'Completed', 'Rejected']

const STATUS_COLORS = {
    Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Paid: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Delivered: 'bg-green-500/10 text-green-400 border-green-500/30',
    Cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
    Reviewed: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    InProduction: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30',
    Completed: 'bg-green-500/10 text-green-400 border-green-500/30',
    Rejected: 'bg-red-500/10 text-red-400 border-red-500/30',
}

export default function OrdersAdmin() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(null)
    const [updatingId, setUpdatingId] = useState(null)
    const [filterStatus, setFilterStatus] = useState('All')

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [ordersRes, designsRes] = await Promise.all([
                    adminGetOrders().catch(() => ({ data: { orders: [] } })),
                    adminGetAllDesigns().catch(() => ({ data: { designs: [] } }))
                ])

                const normalOrders = (ordersRes.data.orders || []).map(o => ({ ...o, isCustomDesign: false }))

                const customDesigns = (designsRes.data.designs || []).map(d => {
                    let title = 'Custom Design T-Shirt'
                    let address = 'N/A'
                    let size = d.printSize || 'N/A'

                    if (d.note) {
                        const titleMatch = d.note.match(/Title:\s*(.*?)\s*\|/)
                        const addressMatch = d.note.match(/Address:\s*(.*?)\s*\|/)
                        const sizeMatch = d.note.match(/T-Shirt:\s*(.*?)\s*\|/)

                        if (titleMatch) title = titleMatch[1]
                        if (addressMatch) address = addressMatch[1]
                        if (sizeMatch) size = sizeMatch[1]
                    }

                    return {
                        id: `CD-${d.id}`,
                        realId: d.id,
                        isCustomDesign: true,
                        userId: d.userId,
                        user: { name: `User ID: ${d.userId}` },
                        createdAt: d.createdAt,
                        totalAmount: 509,
                        orderStatus: d.status,
                        address: address,
                        designNote: d.note,
                        imageUrl: d.imageUrl,
                        orderItems: [{
                            product: { name: title, images: [{ imageUrl: d.imageUrl }] },
                            size: size,
                            quantity: d.quantity,
                            price: 509
                        }]
                    }
                })

                const combined = [...normalOrders, ...customDesigns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                setOrders(combined)
            } catch (err) {
                toast.error('Failed to load orders and designs')
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const handleStatusChange = async (order, newStatus) => {
        setUpdatingId(order.id)
        try {
            if (order.isCustomDesign) {
                await adminUpdateDesignStatus(order.realId, newStatus, 'Status updated via Orders')
            } else {
                await adminUpdateOrderStatus(order.id, newStatus)
            }
            setOrders((prev) => prev.map((o) => o.id === order.id ? { ...o, orderStatus: newStatus } : o))
            toast.success('Status updated')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed')
        } finally {
            setUpdatingId(null)
        }
    }

    const filtered = filterStatus === 'All' ? orders : orders.filter((o) => o.orderStatus === filterStatus)

    if (loading) return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-5xl uppercase text-brand-white">Orders</h1>
                    <p className="text-brand-muted text-sm mt-1">{filtered.length} orders</p>
                </div>
                {/* Filter */}
                <div className="flex gap-2 flex-wrap">
                    {['All', ...STATUS_OPTIONS_ORDER, 'Completed'].map((s) => (
                        <button
                            key={s}
                            onClick={() => setFilterStatus(s)}
                            className={`text-xs font-semibold uppercase tracking-widest px-3 py-1.5 border transition-colors ${filterStatus === s
                                ? 'bg-brand-accent text-brand-black border-brand-accent'
                                : 'border-brand-border text-brand-muted hover:text-brand-white'
                                }`}
                        >
                            {s === 'Completed' ? 'Dispatched' : s}
                        </button>
                    ))}
                </div>
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-24 card">
                    <p className="text-brand-muted text-sm uppercase tracking-widest">No orders found</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {filtered.map((order) => (
                        <div key={order.id} className="card">
                            <button
                                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                className="w-full p-4 flex items-center gap-4 hover:bg-brand-black/30 transition-colors flex-wrap text-left"
                            >
                                <div className="min-w-0">
                                    <p className="text-[10px] text-brand-muted uppercase tracking-widest">Order</p>
                                    <p className="text-sm font-bold text-brand-white">#{order.id}</p>
                                </div>
                                <div className="min-w-0">
                                    <p className="text-[10px] text-brand-muted uppercase tracking-widest">Customer</p>
                                    <p className="text-sm text-brand-white truncate max-w-[140px]">{order.user?.name}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-brand-muted uppercase tracking-widest">Date</p>
                                    <p className="text-xs text-brand-white">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-brand-muted uppercase tracking-widest">Amount</p>
                                    <p className="text-sm font-bold text-brand-white">₹{order.totalAmount?.toLocaleString()}</p>
                                </div>
                                <span className={`status-badge border ml-auto ${STATUS_COLORS[order.orderStatus] || ''}`}>
                                    {order.orderStatus === 'Completed' ? 'Dispatched (Completed)' : order.orderStatus}
                                </span>
                                {expanded === order.id ? <HiChevronUp className="text-brand-muted flex-shrink-0" /> : <HiChevronDown className="text-brand-muted flex-shrink-0" />}
                            </button>

                            {expanded === order.id && (
                                <div className="border-t border-brand-border px-4 pb-4 pt-4 animate-fade-in">
                                    {/* Customer Info */}
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4 text-xs">
                                        <div>
                                            <p className="label">Customer</p>
                                            <p className="text-brand-white">{order.user?.name}</p>
                                            <p className="text-brand-muted">{order.user?.email}</p>
                                        </div>
                                        <div className="md:col-span-2">
                                            <p className="label">Address</p>
                                            <p className="text-brand-white">{order.address}</p>
                                        </div>
                                    </div>

                                    {/* Order Items */}
                                    <div className="space-y-2 mb-4">
                                        {order.orderItems?.map((oi, i) => {
                                            const img = oi.product?.images?.[0]?.imageUrl || oi.product?.images?.[0]
                                            return (
                                                <div key={i} className="flex gap-3 items-center bg-brand-black/30 p-2">
                                                    <div className="w-10 h-12 flex-shrink-0 bg-brand-black overflow-hidden">
                                                        {img ? <img src={getImageUrl(img)} alt="" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center font-display text-xs text-brand-border">PP</div>}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="text-xs font-semibold text-brand-white">{oi.product?.name}</p>
                                                        <p className="text-[10px] text-brand-muted">Size: {oi.size} · Qty: {oi.quantity}</p>
                                                    </div>
                                                    <p className="text-xs font-bold text-brand-white">₹{(oi.price * oi.quantity).toLocaleString()}</p>
                                                </div>
                                            )
                                        })}
                                    </div>

                                    {/* Status Update */}
                                    <div className="flex items-center gap-3">
                                        <label className="label mb-0">Update Status:</label>
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => handleStatusChange(order, e.target.value)}
                                            disabled={updatingId === order.id}
                                            className="input-field max-w-[160px] cursor-pointer text-xs"
                                        >
                                            {(order.isCustomDesign ? STATUS_OPTIONS_DESIGN : STATUS_OPTIONS_ORDER).map((s) => (
                                                <option key={s} value={s}>{s === 'Completed' ? 'Dispatched (Completed)' : s === 'InProduction' ? 'In Production' : s}</option>
                                            ))}
                                        </select>
                                        {updatingId === order.id && (
                                            <span className="w-4 h-4 border-2 border-brand-accent border-t-transparent rounded-full animate-spin" />
                                        )}

                                        {order.isCustomDesign && (
                                            <a href={order.imageUrl} target="_blank" rel="noopener noreferrer" className="ml-auto text-xs text-brand-accent hover:underline">
                                                View Source Design Image
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
