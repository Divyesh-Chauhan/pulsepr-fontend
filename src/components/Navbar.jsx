import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { HiOutlineShoppingBag, HiOutlineUser, HiOutlineMenu, HiX } from 'react-icons/hi'

export default function Navbar() {
    const { isAuthenticated, isAdmin, user, logout } = useAuth()
    const { cartCount } = useCart()
    const navigate = useNavigate()
    const location = useLocation()
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const [userDropdown, setUserDropdown] = useState(false)

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    useEffect(() => {
        setMenuOpen(false)
        setUserDropdown(false)
    }, [location.pathname])

    const handleLogout = () => {
        logout()
        navigate('/')
    }

    const navLinks = [
        { to: '/', label: 'Home' },
        { to: '/products', label: 'Shop' },
        { to: '/custom-design', label: 'Custom' },
    ]

    return (
        <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-brand-black/95 backdrop-blur-sm border-b border-brand-border' : 'bg-transparent'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link to="/" className="font-display text-2xl tracking-widest text-brand-white hover:text-brand-accent transition-colors">
                        PULSEPR
                    </Link>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex items-center gap-8">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className={`text-xs font-semibold uppercase tracking-widest transition-colors ${location.pathname === link.to
                                    ? 'text-brand-accent'
                                    : 'text-brand-muted hover:text-brand-white'
                                    }`}
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link to="/admin" className="text-xs font-semibold uppercase tracking-widest text-brand-accent hover:text-white transition-colors">
                                Admin
                            </Link>
                        )}
                    </div>

                    {/* Right Icons */}
                    <div className="flex items-center gap-2">
                        {/* Cart */}
                        {isAuthenticated && (
                            <Link to="/cart" className="relative p-2 text-brand-muted hover:text-brand-white transition-colors">
                                <HiOutlineShoppingBag size={22} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 bg-brand-accent text-brand-black text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </Link>
                        )}

                        {/* User Menu */}
                        {isAuthenticated ? (
                            <div className="relative">
                                <button
                                    onClick={() => setUserDropdown(!userDropdown)}
                                    className="flex items-center gap-2 p-2 text-brand-muted hover:text-brand-white transition-colors"
                                >
                                    <HiOutlineUser size={22} />
                                    <span className="hidden md:inline text-xs font-semibold uppercase tracking-widest">
                                        {user?.name?.split(' ')[0]}
                                    </span>
                                </button>
                                {userDropdown && (
                                    <div className="absolute right-0 top-full mt-2 w-44 bg-brand-gray border border-brand-border shadow-2xl z-50 animate-fade-in">
                                        <Link to="/profile" className="block px-4 py-3 text-xs font-semibold uppercase tracking-widest text-brand-muted hover:bg-brand-black hover:text-brand-white transition-colors">
                                            Profile
                                        </Link>
                                        <Link to="/orders" className="block px-4 py-3 text-xs font-semibold uppercase tracking-widest text-brand-muted hover:bg-brand-black hover:text-brand-white transition-colors">
                                            My Orders
                                        </Link>
                                        {isAdmin && (
                                            <Link to="/admin" className="block px-4 py-3 text-xs font-semibold uppercase tracking-widest text-brand-accent hover:bg-brand-black transition-colors">
                                                Admin Panel
                                            </Link>
                                        )}
                                        <hr className="border-brand-border" />
                                        <button
                                            onClick={handleLogout}
                                            className="w-full text-left px-4 py-3 text-xs font-semibold uppercase tracking-widest text-red-500 hover:bg-brand-black transition-colors"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link to="/login" className="btn-primary py-2 text-xs hidden md:inline-flex">
                                Login
                            </Link>
                        )}

                        {/* Mobile Menu Toggle */}
                        <button
                            className="md:hidden p-2 text-brand-muted hover:text-brand-white transition-colors"
                            onClick={() => setMenuOpen(!menuOpen)}
                        >
                            {menuOpen ? <HiX size={22} /> : <HiOutlineMenu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden bg-brand-gray border-t border-brand-border animate-fade-in">
                    <div className="px-4 py-4 flex flex-col gap-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="block px-4 py-3 text-xs font-semibold uppercase tracking-widest text-brand-muted hover:text-brand-white hover:bg-brand-black transition-colors"
                            >
                                {link.label}
                            </Link>
                        ))}
                        {isAdmin && (
                            <Link to="/admin" className="block px-4 py-3 text-xs font-semibold uppercase tracking-widest text-brand-accent">
                                Admin Panel
                            </Link>
                        )}
                        {!isAuthenticated && (
                            <Link to="/login" className="mt-2 btn-primary w-full justify-center">
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            )}
        </nav>
    )
}
