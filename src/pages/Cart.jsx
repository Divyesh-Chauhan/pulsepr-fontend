import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import Loader from '../components/Loader'
import { HiOutlineTrash, HiArrowRight, HiMinus, HiPlus } from 'react-icons/hi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getImageUrl(url) {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
}

export default function Cart() {
    const { cart, loading, updateItem, removeItem, cartTotal } = useCart()
    const navigate = useNavigate()
    const [updatingId, setUpdatingId] = useState(null)

    const items = cart?.items || []

    const handleUpdate = async (itemId, qty) => {
        setUpdatingId(itemId)
        try { await updateItem(itemId, qty) } finally { setUpdatingId(null) }
    }

    const handleRemove = async (itemId) => {
        setUpdatingId(itemId)
        try { await removeItem(itemId) } finally { setUpdatingId(null) }
    }

    if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center"><Loader size="lg" /></div>

    return (
        <div className="min-h-screen pt-20 page-enter">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="font-display text-6xl uppercase text-brand-white mb-8">Your Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-32">
                        <p className="text-6xl mb-6">🛒</p>
                        <p className="text-brand-muted text-sm uppercase tracking-widest mb-8">Your cart is empty</p>
                        <Link to="/products" className="btn-primary">
                            Start Shopping <HiArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {items.map((item) => {
                                const img = item.product?.images?.[0]?.imageUrl || item.product?.images?.[0]
                                const price = item.product?.discountPrice || item.product?.price || 0
                                return (
                                    <div key={item.id} className="card p-4 flex gap-4 items-start">
                                        {/* Image */}
                                        <div className="w-20 h-24 flex-shrink-0 overflow-hidden bg-brand-black">
                                            {img ? (
                                                <img src={getImageUrl(img)} alt={item.product?.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center">
                                                    <span className="font-display text-3xl text-brand-border">PP</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-brand-white line-clamp-2">{item.product?.name}</h3>
                                            <p className="text-xs text-brand-muted mt-1 uppercase tracking-widest">Size: {item.size}</p>
                                            <p className="text-brand-accent font-bold mt-1">₹{price.toLocaleString()}</p>

                                            <div className="flex items-center justify-between mt-3">
                                                {/* Quantity */}
                                                <div className="flex items-center border border-brand-border">
                                                    <button
                                                        onClick={() => handleUpdate(item.id, item.quantity - 1)}
                                                        disabled={updatingId === item.id || item.quantity <= 1}
                                                        className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-brand-white disabled:opacity-40 transition-colors"
                                                    >
                                                        <HiMinus size={12} />
                                                    </button>
                                                    <span className="w-8 h-8 flex items-center justify-center text-brand-white text-xs font-bold border-x border-brand-border">
                                                        {updatingId === item.id ? (
                                                            <span className="w-3 h-3 border border-brand-accent border-t-transparent rounded-full animate-spin" />
                                                        ) : item.quantity}
                                                    </span>
                                                    <button
                                                        onClick={() => handleUpdate(item.id, item.quantity + 1)}
                                                        disabled={updatingId === item.id}
                                                        className="w-8 h-8 flex items-center justify-center text-brand-muted hover:text-brand-white disabled:opacity-40 transition-colors"
                                                    >
                                                        <HiPlus size={12} />
                                                    </button>
                                                </div>

                                                {/* Subtotal */}
                                                <p className="text-sm font-bold text-brand-white">
                                                    ₹{(price * item.quantity).toLocaleString()}
                                                </p>

                                                {/* Remove */}
                                                <button
                                                    onClick={() => handleRemove(item.id)}
                                                    disabled={updatingId === item.id}
                                                    className="p-2 text-brand-muted hover:text-red-500 transition-colors disabled:opacity-40"
                                                >
                                                    <HiOutlineTrash size={16} />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="card p-6 sticky top-24">
                                <h2 className="text-sm font-semibold uppercase tracking-widest text-brand-white mb-6">Order Summary</h2>
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between text-brand-muted">
                                        <span>Subtotal ({items.length} items)</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-brand-muted">
                                        <span>Shipping</span>
                                        <span className="text-green-400">FREE</span>
                                    </div>
                                    <hr className="border-brand-border" />
                                    <div className="flex justify-between text-brand-white font-bold text-base">
                                        <span>Total</span>
                                        <span>₹{cartTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/checkout')}
                                    className="btn-primary w-full justify-center mt-6"
                                >
                                    Proceed to Checkout <HiArrowRight size={16} />
                                </button>
                                <Link to="/products" className="btn-secondary w-full justify-center mt-3 text-xs">
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
