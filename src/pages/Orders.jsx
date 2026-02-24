import { useState, useEffect } from 'react'
import api from '../api/axios'
import Loader from '../components/Loader'
import { HiOutlineShoppingBag, HiChevronDown, HiChevronUp } from 'react-icons/hi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
function getImageUrl(url) {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
}

const STATUS_COLORS = {
    Pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
    Paid: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    Shipped: 'bg-purple-500/10 text-purple-400 border-purple-500/30',
    Delivered: 'bg-green-500/10 text-green-400 border-green-500/30',
    Cancelled: 'bg-red-500/10 text-red-400 border-red-500/30',
}

export default function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [expanded, setExpanded] = useState(null)

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                // Fetch user's own orders from the user-specific endpoint
                const res = await api.get('/api/auth/orders')
                setOrders(res.data.orders || [])
            } catch {
                // Fallback: if no user-specific route, show empty
                setOrders([])
            } finally {
                setLoading(false)
            }
        }
        fetchOrders()
    }, [])

    if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center"><Loader size="lg" /></div>

    return (
        <div className="min-h-screen pt-20 page-enter">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="font-display text-6xl uppercase text-brand-white mb-2">My Orders</h1>
                <p className="text-brand-muted text-sm mb-10">{orders.length} order{orders.length !== 1 ? 's' : ''}</p>

                {orders.length === 0 ? (
                    <div className="text-center py-32">
                        <HiOutlineShoppingBag size={48} className="mx-auto text-brand-border mb-6" />
                        <p className="text-brand-muted text-sm uppercase tracking-widest">No orders yet</p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="card">
                                {/* Order Header */}
                                <button
                                    onClick={() => setExpanded(expanded === order.id ? null : order.id)}
                                    className="w-full p-6 flex items-center justify-between hover:bg-brand-black/30 transition-colors"
                                >
                                    <div className="flex items-center gap-6 flex-wrap">
                                        <div className="text-left">
                                            <p className="text-[10px] text-brand-muted uppercase tracking-widest">Order ID</p>
                                            <p className="text-sm font-bold text-brand-white">#{order.id}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] text-brand-muted uppercase tracking-widest">Date</p>
                                            <p className="text-sm text-brand-white">{new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                        </div>
                                        <div className="text-left">
                                            <p className="text-[10px] text-brand-muted uppercase tracking-widest">Total</p>
                                            <p className="text-sm font-bold text-brand-white">₹{order.totalAmount?.toLocaleString()}</p>
                                        </div>
                                        <span className={`status-badge border ${STATUS_COLORS[order.orderStatus] || 'bg-brand-gray text-brand-muted border-brand-border'}`}>
                                            {order.orderStatus}
                                        </span>
                                    </div>
                                    {expanded === order.id ? <HiChevronUp className="text-brand-muted flex-shrink-0" /> : <HiChevronDown className="text-brand-muted flex-shrink-0" />}
                                </button>

                                {/* Expanded Details */}
                                {expanded === order.id && (
                                    <div className="border-t border-brand-border px-6 pb-6 pt-4 animate-fade-in">
                                        <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-1">Delivery Address</p>
                                        <p className="text-sm text-brand-white mb-4">{order.address}</p>

                                        <div className="space-y-3">
                                            {order.orderItems?.map((oi, i) => {
                                                const img = oi.product?.images?.[0]?.imageUrl || oi.product?.images?.[0]
                                                return (
                                                    <div key={i} className="flex gap-3 items-center">
                                                        <div className="w-12 h-14 flex-shrink-0 bg-brand-black overflow-hidden">
                                                            {img ? (
                                                                <img src={getImageUrl(img)} alt={oi.product?.name} className="w-full h-full object-cover" />
                                                            ) : (
                                                                <div className="w-full h-full flex items-center justify-center font-display text-xs text-brand-border">PP</div>
                                                            )}
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

                                        {/* Status Timeline */}
                                        <div className="mt-6 flex items-center gap-0 overflow-x-auto">
                                            {['Paid', 'Shipped', 'Delivered'].map((s, i, arr) => {
                                                const statuses = ['Pending', 'Paid', 'Shipped', 'Delivered', 'Cancelled']
                                                const currentIdx = statuses.indexOf(order.orderStatus)
                                                const stepIdx = statuses.indexOf(s)
                                                const done = currentIdx >= stepIdx && order.orderStatus !== 'Cancelled'
                                                return (
                                                    <div key={s} className="flex items-center">
                                                        <div className={`flex flex-col items-center ${done ? '' : 'opacity-40'}`}>
                                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${done ? 'bg-brand-accent text-brand-black' : 'bg-brand-border text-brand-muted'}`}>
                                                                {i + 1}
                                                            </div>
                                                            <span className="text-[9px] uppercase tracking-widest mt-1 text-brand-muted whitespace-nowrap">{s}</span>
                                                        </div>
                                                        {i < arr.length - 1 && (
                                                            <div className={`h-px w-12 mx-1 mb-4 ${done ? 'bg-brand-accent' : 'bg-brand-border'}`} />
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
