import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import {
    HiOutlineHome,
    HiOutlineShoppingBag,
    HiOutlineClipboardList,
    HiOutlineUsers,
    HiOutlineTag,
    HiOutlineLogout,
    HiX,
} from 'react-icons/hi'
import { MdOutlineAddBox } from 'react-icons/md'

const navItems = [
    { to: '/admin', label: 'Dashboard', icon: HiOutlineHome, end: true },
    { to: '/admin/products', label: 'Products', icon: HiOutlineShoppingBag },
    { to: '/admin/products/add', label: 'Add Product', icon: MdOutlineAddBox },
    { to: '/admin/orders', label: 'Orders', icon: HiOutlineClipboardList },
    { to: '/admin/users', label: 'Users', icon: HiOutlineUsers },
    { to: '/admin/offers', label: 'Offers', icon: HiOutlineTag },
    { to: '/admin/designs', label: 'Designs', icon: HiOutlineClipboardList },
]

export default function AdminSidebar({ onClose }) {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    return (
        <aside className="w-64 h-full bg-brand-gray border-r border-brand-border flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-brand-border">
                <div>
                    <span className="font-display text-xl tracking-widest text-brand-white">PULSEPR</span>
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-accent mt-0.5">Admin Panel</p>
                </div>
                {onClose && (
                    <button onClick={onClose} className="md:hidden text-brand-muted hover:text-brand-white transition-colors">
                        <HiX size={20} />
                    </button>
                )}
            </div>

            {/* Nav */}
            <nav className="flex-1 py-6 overflow-y-auto">
                <div className="px-3 space-y-1">
                    {navItems.map(({ to, label, icon: Icon, end }) => (
                        <NavLink
                            key={to}
                            to={to}
                            end={end}
                            onClick={onClose}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-3 py-2.5 text-xs font-semibold uppercase tracking-widest transition-all duration-150 rounded-none ${isActive
                                    ? 'bg-brand-accent text-brand-black'
                                    : 'text-brand-muted hover:text-brand-white hover:bg-brand-black'
                                }`
                            }
                        >
                            <Icon size={18} />
                            {label}
                        </NavLink>
                    ))}
                </div>
            </nav>

            {/* User + Logout */}
            <div className="border-t border-brand-border p-4">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-brand-accent/20 border border-brand-accent/40 flex items-center justify-center">
                        <span className="text-brand-accent text-xs font-bold">{user?.name?.[0]?.toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                        <p className="text-xs font-semibold text-brand-white truncate">{user?.name}</p>
                        <p className="text-[10px] text-brand-muted truncate">{user?.email}</p>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full px-3 py-2 text-xs font-semibold uppercase tracking-widest text-red-500 hover:bg-red-500/10 transition-colors"
                >
                    <HiOutlineLogout size={16} />
                    Logout
                </button>
            </div>
        </aside>
    )
}
