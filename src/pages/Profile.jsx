import { useAuth } from '../context/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineUser, HiOutlineShoppingBag, HiOutlineLogout } from 'react-icons/hi'

export default function Profile() {
    const { user, logout, isAdmin } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const initial = user?.name?.[0]?.toUpperCase() || 'U'

    return (
        <div className="min-h-screen pt-20 page-enter">
            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                {/* Avatar */}
                <div className="flex flex-col items-center mb-12">
                    <div className="w-24 h-24 rounded-full bg-brand-gray border-2 border-brand-accent flex items-center justify-center">
                        <span className="font-display text-4xl text-brand-accent">{initial}</span>
                    </div>
                    <h1 className="font-display text-4xl uppercase text-brand-white mt-4">{user?.name}</h1>
                    <p className="text-brand-muted text-sm mt-1">{user?.email}</p>
                    {isAdmin && (
                        <span className="mt-2 tag bg-brand-accent/20 text-brand-accent border border-brand-accent/30 text-[10px]">
                            Admin
                        </span>
                    )}
                </div>

                {/* Info Card */}
                <div className="card p-6 mb-4">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-4">Account Details</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="label">Name</label>
                            <p className="text-brand-white text-sm">{user?.name}</p>
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <p className="text-brand-white text-sm">{user?.email}</p>
                        </div>
                        <div>
                            <label className="label">Role</label>
                            <p className="text-brand-white text-sm capitalize">{user?.role?.toLowerCase()}</p>
                        </div>
                    </div>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                    <Link to="/orders" className="card p-5 flex items-center gap-4 hover:border-brand-accent transition-colors">
                        <HiOutlineShoppingBag size={24} className="text-brand-accent" />
                        <div>
                            <p className="text-sm font-semibold text-brand-white">My Orders</p>
                            <p className="text-xs text-brand-muted">Track your orders</p>
                        </div>
                    </Link>
                    {isAdmin && (
                        <Link to="/admin" className="card p-5 flex items-center gap-4 hover:border-brand-accent transition-colors">
                            <HiOutlineUser size={24} className="text-brand-accent" />
                            <div>
                                <p className="text-sm font-semibold text-brand-white">Admin Panel</p>
                                <p className="text-xs text-brand-muted">Manage the store</p>
                            </div>
                        </Link>
                    )}
                </div>

                <button
                    onClick={handleLogout}
                    className="w-full card p-5 flex items-center gap-4 hover:border-red-500/40 transition-colors text-left"
                >
                    <HiOutlineLogout size={24} className="text-red-500" />
                    <div>
                        <p className="text-sm font-semibold text-red-500">Logout</p>
                        <p className="text-xs text-brand-muted">Sign out of your account</p>
                    </div>
                </button>
            </div>
        </div>
    )
}
