import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { createOrder, verifyPayment } from '../api/services'
import toast from 'react-hot-toast'
import { HiLockClosed, HiArrowLeft } from 'react-icons/hi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getImageUrl(url) {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
}

export default function Checkout() {
    const { cart, cartTotal, fetchCart } = useCart()
    const { user } = useAuth()
    const navigate = useNavigate()
    const [address, setAddress] = useState('')
    const [loading, setLoading] = useState(false)

    const items = cart?.items || []
    const orderItems = items.map((item) => ({
        productId: item.product.id,
        size: item.size,
        quantity: item.quantity,
    }))

    const handlePayment = async (e) => {
        e.preventDefault()
        if (!address.trim()) { toast.error('Please enter a delivery address'); return }
        if (items.length === 0) { toast.error('Your cart is empty'); return }
        setLoading(true)

        try {
            // Step 1: Create Razorpay order
            const orderRes = await createOrder({ items: orderItems, address })
            const { order, totalAmount } = orderRes.data

            // Step 2: Open Razorpay popup
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.amount,
                currency: order.currency || 'INR',
                name: 'PULSEPR',
                description: 'Purchase from PULSEPR',
                order_id: order.id,
                prefill: {
                    name: user?.name,
                    email: user?.email,
                },
                theme: { color: '#d4ff00' },
                handler: async (response) => {
                    // Step 3: Verify payment
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            items: orderItems,
                            address,
                            totalAmount,
                        })
                        await fetchCart()
                        toast.success('Payment successful! Order placed.')
                        navigate('/order-success')
                    } catch {
                        toast.error('Payment verification failed. Contact support.')
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.error('Payment cancelled')
                        setLoading(false)
                    },
                },
            }

            const rzp = new window.Razorpay(options)
            rzp.on('payment.failed', () => {
                toast.error('Payment failed. Please try again.')
                setLoading(false)
            })
            rzp.open()
            setLoading(false)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Could not initiate payment')
            setLoading(false)
        }
    }

    const img0 = (item) => {
        const url = item.product?.images?.[0]?.imageUrl || item.product?.images?.[0]
        return getImageUrl(url)
    }

    return (
        <div className="min-h-screen pt-20 page-enter">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <button onClick={() => navigate('/cart')} className="flex items-center gap-2 text-brand-muted hover:text-brand-white text-xs font-semibold uppercase tracking-widest mb-8 transition-colors">
                    <HiArrowLeft size={16} /> Back to Cart
                </button>

                <h1 className="font-display text-5xl uppercase text-brand-white mb-10">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    {/* Left — Address Form */}
                    <div>
                        <form onSubmit={handlePayment} className="space-y-6">
                            <div className="card p-6">
                                <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-6">Delivery Address</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className="label">Full Name</label>
                                        <input type="text" value={user?.name || ''} readOnly className="input-field opacity-60 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="label">Email</label>
                                        <input type="email" value={user?.email || ''} readOnly className="input-field opacity-60 cursor-not-allowed" />
                                    </div>
                                    <div>
                                        <label className="label">Complete Address *</label>
                                        <textarea
                                            value={address}
                                            onChange={(e) => setAddress(e.target.value)}
                                            placeholder="123 Street, City, State — PIN Code"
                                            rows={3}
                                            required
                                            className="input-field resize-none"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Payment Button */}
                            <button
                                type="submit"
                                disabled={loading || items.length === 0}
                                className="btn-primary w-full justify-center py-5 text-base disabled:opacity-60"
                            >
                                {loading ? (
                                    <span className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <HiLockClosed size={18} />
                                )}
                                {loading ? 'Processing...' : `Pay ₹${cartTotal.toLocaleString()} via Razorpay`}
                            </button>

                            <p className="text-center text-brand-muted text-xs flex items-center justify-center gap-2">
                                <HiLockClosed size={12} /> 100% Secure · Powered by Razorpay
                            </p>
                        </form>
                    </div>

                    {/* Right — Order Summary */}
                    <div className="card p-6">
                        <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-6">Order Summary</h2>
                        <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                            {items.map((item) => {
                                const price = item.product?.discountPrice || item.product?.price || 0
                                return (
                                    <div key={item.id} className="flex gap-3 items-start">
                                        <div className="w-14 h-16 flex-shrink-0 bg-brand-black overflow-hidden">
                                            {img0(item) ? (
                                                <img src={img0(item)} alt={item.product?.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center font-display text-sm text-brand-border">PP</div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-semibold text-brand-white line-clamp-2">{item.product?.name}</p>
                                            <p className="text-[10px] text-brand-muted mt-0.5">Size: {item.size} · Qty: {item.quantity}</p>
                                            <p className="text-xs font-bold text-brand-accent mt-1">₹{(price * item.quantity).toLocaleString()}</p>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                        <hr className="border-brand-border my-4" />
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between text-brand-muted">
                                <span>Subtotal</span><span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-brand-muted">
                                <span>Shipping</span><span className="text-green-400">FREE</span>
                            </div>
                            <div className="flex justify-between text-brand-white font-bold text-base pt-2 border-t border-brand-border">
                                <span>Total</span><span>₹{cartTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
