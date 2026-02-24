import { Link } from 'react-router-dom'
import { HiOutlineShoppingBag } from 'react-icons/hi'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getImageUrl(images) {
    if (!images || images.length === 0) return null
    const img = images[0]
    const url = img?.imageUrl || img
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
}

export default function ProductCard({ product }) {
    const { addItem } = useCart()
    const { isAuthenticated } = useAuth()
    const [adding, setAdding] = useState(false)

    const imgUrl = getImageUrl(product.images)
    const hasDiscount = product.discountPrice && product.discountPrice < product.price
    const discount = hasDiscount
        ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
        : 0

    const handleQuickAdd = async (e) => {
        e.preventDefault()
        if (!isAuthenticated) {
            toast.error('Please login to add to cart')
            return
        }
        const defaultSize = product.sizes?.find((s) => s.stockQuantity > 0)?.size
        if (!defaultSize) { toast.error('Out of stock'); return }
        setAdding(true)
        try {
            await addItem(product.id, defaultSize, 1)
        } finally {
            setAdding(false)
        }
    }

    return (
        <Link to={`/products/${product.id}`} className="group block">
            <div className="relative overflow-hidden bg-brand-gray border border-brand-border hover:border-brand-accent transition-all duration-300">
                {/* Image */}
                <div className="product-img-wrapper aspect-[3/4] overflow-hidden bg-[#111]">
                    {imgUrl ? (
                        <img
                            src={imgUrl}
                            alt={product.name}
                            className="w-full h-full object-cover"
                            loading="lazy"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="font-display text-6xl text-brand-border">PP</span>
                        </div>
                    )}
                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                        {hasDiscount && (
                            <span className="tag bg-brand-accent text-brand-black text-[10px]">
                                -{discount}%
                            </span>
                        )}
                        {!product.isActive && (
                            <span className="tag bg-red-500/20 text-red-400 text-[10px]">Inactive</span>
                        )}
                    </div>
                    {/* Quick Add Button */}
                    <button
                        onClick={handleQuickAdd}
                        disabled={adding}
                        className="absolute bottom-0 left-0 right-0 bg-brand-black/90 text-brand-white py-3 text-xs font-semibold uppercase tracking-widest
                       translate-y-full group-hover:translate-y-0 transition-transform duration-300
                       hover:bg-brand-accent hover:text-brand-black flex items-center justify-center gap-2"
                    >
                        {adding ? (
                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <HiOutlineShoppingBag size={14} />
                        )}
                        {adding ? 'Adding...' : 'Quick Add'}
                    </button>
                </div>

                {/* Info */}
                <div className="p-4">
                    <p className="text-[10px] font-semibold uppercase tracking-widest text-brand-muted mb-1">
                        {product.category}
                    </p>
                    <h3 className="text-sm font-semibold text-brand-white group-hover:text-brand-accent transition-colors line-clamp-2">
                        {product.name}
                    </h3>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="text-sm font-bold text-brand-white">
                            ₹{(product.discountPrice || product.price).toLocaleString()}
                        </span>
                        {hasDiscount && (
                            <span className="text-xs text-brand-muted line-through">
                                ₹{product.price.toLocaleString()}
                            </span>
                        )}
                    </div>
                    {/* Size availability */}
                    <div className="flex gap-1 mt-3 flex-wrap">
                        {product.sizes?.map((s) => (
                            <span
                                key={s.id}
                                className={`text-[9px] font-bold uppercase tracking-widest px-1.5 py-0.5 border ${s.stockQuantity > 0
                                        ? 'border-brand-border text-brand-muted'
                                        : 'border-brand-border/30 text-brand-border/40 line-through'
                                    }`}
                            >
                                {s.size}
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </Link>
    )
}
