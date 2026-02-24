import { useState, useEffect } from 'react'
import { adminGetStats } from '../api/services'
import Loader from '../components/Loader'
import { Link } from 'react-router-dom'
import {
    HiOutlineUsers,
    HiOutlineShoppingBag,
    HiOutlineCurrencyRupee,
    HiOutlineTrendingUp,
    HiArrowRight,
} from 'react-icons/hi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
function getImageUrl(url) {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
}

export default function Dashboard() {
    const [stats, setStats] = useState(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        adminGetStats()
            .then((res) => setStats(res.data.stats))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>

    const statCards = [
        {
            label: 'Total Revenue',
            value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`,
            icon: HiOutlineCurrencyRupee,
            color: 'text-brand-accent',
            bg: 'bg-brand-accent/10 border-brand-accent/30',
        },
        {
            label: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: HiOutlineShoppingBag,
            color: 'text-blue-400',
            bg: 'bg-blue-500/10 border-blue-500/30',
        },
        {
            label: 'Total Users',
            value: stats?.totalUsers || 0,
            icon: HiOutlineUsers,
            color: 'text-purple-400',
            bg: 'bg-purple-500/10 border-purple-500/30',
        },
        {
            label: 'Top Products',
            value: stats?.topSellingProducts?.length || 0,
            icon: HiOutlineTrendingUp,
            color: 'text-green-400',
            bg: 'bg-green-500/10 border-green-500/30',
        },
    ]

    return (
        <div className="animate-fade-in">
            {/* Header */}
            <div className="mb-8">
                <h1 className="font-display text-5xl uppercase text-brand-white">Dashboard</h1>
                <p className="text-brand-muted text-sm mt-1">Welcome back! Here's your store overview.</p>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-10">
                {statCards.map((card) => {
                    const Icon = card.icon
                    return (
                        <div key={card.label} className={`admin-stat-card border ${card.bg}`}>
                            <div className="flex items-center justify-between">
                                <span className="label mb-0">{card.label}</span>
                                <div className={`p-2 rounded-full ${card.bg}`}>
                                    <Icon size={20} className={card.color} />
                                </div>
                            </div>
                            <p className={`font-display text-4xl ${card.color} mt-2`}>{card.value}</p>
                        </div>
                    )
                })}
            </div>

            {/* Top Selling Products */}
            <div className="card p-6">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-white">Top Selling Products</h2>
                    <Link to="/admin/products" className="text-xs text-brand-accent hover:text-brand-white transition-colors flex items-center gap-1">
                        View All <HiArrowRight size={12} />
                    </Link>
                </div>

                {!stats?.topSellingProducts?.length ? (
                    <p className="text-brand-muted text-sm text-center py-8">No sales data yet.</p>
                ) : (
                    <div className="space-y-4">
                        {stats.topSellingProducts.map((p, i) => {
                            const img = p.images?.[0]?.imageUrl || p.images?.[0]
                            return (
                                <div key={p.id} className="flex items-center gap-4">
                                    <span className="font-display text-2xl text-brand-border w-6 flex-shrink-0">{i + 1}</span>
                                    <div className="w-10 h-12 flex-shrink-0 bg-brand-black overflow-hidden">
                                        {img ? (
                                            <img src={getImageUrl(img)} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center font-display text-xs text-brand-border">PP</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm font-semibold text-brand-white truncate">{p.name}</p>
                                        <p className="text-[10px] text-brand-muted uppercase tracking-widest">{p.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-bold text-brand-accent">{p.totalSold} sold</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                {[
                    { to: '/admin/products/add', label: 'Add Product' },
                    { to: '/admin/orders', label: 'View Orders' },
                    { to: '/admin/users', label: 'View Users' },
                    { to: '/admin/offers', label: 'Manage Offers' },
                ].map((action) => (
                    <Link key={action.to} to={action.to} className="btn-secondary justify-center text-xs">
                        {action.label}
                    </Link>
                ))}
            </div>
        </div>
    )
}
