import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getProductById } from '../api/services'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { HiArrowLeft, HiOutlineShoppingBag, HiCheckCircle } from 'react-icons/hi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

function getImageUrl(url) {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
}

export default function ProductDetails() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addItem } = useCart()
    const { isAuthenticated } = useAuth()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [selectedImage, setSelectedImage] = useState(0)
    const [selectedSize, setSelectedSize] = useState(null)
    const [quantity, setQuantity] = useState(1)
    const [adding, setAdding] = useState(false)

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true)
                const res = await getProductById(id)
                setProduct(res.data.product)
                // auto select first in-stock size
                const first = res.data.product.sizes?.find((s) => s.stockQuantity > 0)
                if (first) setSelectedSize(first.size)
            } catch {
                toast.error('Product not found')
                navigate('/products')
            } finally {
                setLoading(false)
            }
        }
        fetch()
    }, [id, navigate])

    const handleAddToCart = async () => {
        if (!isAuthenticated) { navigate('/login'); return }
        if (!selectedSize) { toast.error('Please select a size'); return }
        setAdding(true)
        try {
            await addItem(product.id, selectedSize, quantity)
        } finally {
            setAdding(false)
        }
    }

    if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center"><Loader size="lg" /></div>
    if (!product) return null

    const images = product.images || []
    const hasDiscount = product.discountPrice && product.discountPrice < product.price
    const discount = hasDiscount ? Math.round(((product.price - product.discountPrice) / product.price) * 100) : 0
    const selectedSizeStock = product.sizes?.find((s) => s.size === selectedSize)?.stockQuantity || 0

    return (
        <div className="min-h-screen pt-20 page-enter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Back */}
                <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-brand-muted hover:text-brand-white text-xs font-semibold uppercase tracking-widest mb-8 transition-colors">
                    <HiArrowLeft size={16} /> Back
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
                    {/* Images */}
                    <div className="flex flex-col-reverse md:flex-row gap-4">
                        {/* Thumbnails */}
                        {images.length > 1 && (
                            <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-visible">
                                {images.map((img, i) => (
                                    <button
                                        key={img.id || i}
                                        onClick={() => setSelectedImage(i)}
                                        className={`flex-shrink-0 w-16 h-20 md:w-20 md:h-24 overflow-hidden border-2 transition-colors ${selectedImage === i ? 'border-brand-accent' : 'border-brand-border hover:border-brand-muted'
                                            }`}
                                    >
                                        <img
                                            src={getImageUrl(img.imageUrl || img)}
                                            alt=""
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                        {/* Main Image */}
                        <div className="flex-1 aspect-[3/4] overflow-hidden bg-brand-gray border border-brand-border relative">
                            {images[selectedImage] ? (
                                <img
                                    src={getImageUrl(images[selectedImage]?.imageUrl || images[selectedImage])}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                    <span className="font-display text-8xl text-brand-border">PP</span>
                                </div>
                            )}
                            {hasDiscount && (
                                <span className="absolute top-4 left-4 tag bg-brand-accent text-brand-black text-xs">
                                    -{discount}%
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Info */}
                    <div className="flex flex-col">
                        <p className="text-xs font-semibold uppercase tracking-widest text-brand-accent mb-3">{product.category}</p>
                        <h1 className="font-display text-4xl md:text-5xl uppercase text-brand-white leading-tight">{product.name}</h1>
                        <p className="text-brand-muted text-xs uppercase tracking-widest mt-1">{product.brand}</p>

                        {/* Price */}
                        <div className="flex items-center gap-4 mt-6">
                            <span className="text-3xl font-bold text-brand-white">
                                ₹{(product.discountPrice || product.price).toLocaleString()}
                            </span>
                            {hasDiscount && (
                                <>
                                    <span className="text-lg text-brand-muted line-through">₹{product.price.toLocaleString()}</span>
                                    <span className="tag bg-brand-accent/20 text-brand-accent text-xs">Save {discount}%</span>
                                </>
                            )}
                        </div>

                        {/* Description */}
                        {product.description && (
                            <p className="mt-6 text-brand-muted text-sm leading-relaxed">{product.description}</p>
                        )}

                        {/* Size Selection */}
                        <div className="mt-8">
                            <div className="flex items-center justify-between mb-3">
                                <label className="label mb-0">Select Size</label>
                                {selectedSize && (
                                    <span className={`text-xs font-semibold ${selectedSizeStock < 5 ? 'text-red-400' : 'text-green-400'}`}>
                                        {selectedSizeStock === 0 ? 'Out of Stock' : selectedSizeStock < 5 ? `Only ${selectedSizeStock} left` : 'In Stock'}
                                    </span>
                                )}
                            </div>
                            <div className="flex gap-2 flex-wrap">
                                {product.sizes?.map((s) => (
                                    <button
                                        key={s.id}
                                        onClick={() => s.stockQuantity > 0 && setSelectedSize(s.size)}
                                        disabled={s.stockQuantity === 0}
                                        className={`w-14 h-12 text-xs font-bold uppercase tracking-widest border-2 transition-all duration-200 ${s.stockQuantity === 0
                                                ? 'border-brand-border/30 text-brand-border/40 cursor-not-allowed line-through'
                                                : selectedSize === s.size
                                                    ? 'border-brand-accent bg-brand-accent text-brand-black'
                                                    : 'border-brand-border text-brand-muted hover:border-brand-white hover:text-brand-white'
                                            }`}
                                    >
                                        {s.size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Quantity */}
                        <div className="mt-6">
                            <label className="label">Quantity</label>
                            <div className="flex items-center border border-brand-border w-fit">
                                <button
                                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                                    className="w-10 h-10 flex items-center justify-center text-brand-muted hover:text-brand-white hover:bg-brand-gray transition-colors text-lg"
                                >
                                    −
                                </button>
                                <span className="w-12 h-10 flex items-center justify-center text-brand-white text-sm font-semibold border-x border-brand-border">
                                    {quantity}
                                </span>
                                <button
                                    onClick={() => setQuantity((q) => Math.min(selectedSizeStock || 10, q + 1))}
                                    className="w-10 h-10 flex items-center justify-center text-brand-muted hover:text-brand-white hover:bg-brand-gray transition-colors text-lg"
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <div className="mt-8 flex flex-col sm:flex-row gap-3">
                            <button
                                onClick={handleAddToCart}
                                disabled={adding || selectedSizeStock === 0}
                                className="btn-primary flex-1 justify-center py-4 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {adding ? (
                                    <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <HiOutlineShoppingBag size={18} />
                                )}
                                {adding ? 'Adding...' : selectedSizeStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                            </button>
                        </div>

                        {/* Trust badges */}
                        <div className="mt-8 pt-8 border-t border-brand-border grid grid-cols-2 gap-4">
                            {[
                                { icon: '✓', label: '100% Authentic' },
                                { icon: '✓', label: 'Free Returns' },
                                { icon: '✓', label: 'Secure Payment' },
                                { icon: '✓', label: 'Fast Delivery' },
                            ].map((b) => (
                                <div key={b.label} className="flex items-center gap-2">
                                    <span className="text-brand-accent text-xs font-bold">{b.icon}</span>
                                    <span className="text-brand-muted text-xs font-semibold uppercase tracking-widest">{b.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
