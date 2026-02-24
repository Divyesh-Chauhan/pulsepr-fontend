import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getAllProducts, adminGetOffers } from '../api/services'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import { HiArrowRight } from 'react-icons/hi'

export default function Home() {
    const [products, setProducts] = useState([])
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [prodRes, offerRes] = await Promise.allSettled([
                    getAllProducts(),
                    adminGetOffers(),
                ])
                if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data.products || [])
                if (offerRes.status === 'fulfilled') setOffers(offerRes.value.data.offers?.filter((o) => o.isActive) || [])
            } finally {
                setLoading(false)
            }
        }
        fetchData()
    }, [])

    const featured = products.slice(0, 8)
    const categories = ['Oversized', 'Regular', 'Graphic Tee', 'Hoodie']

    return (
        <div className="page-enter">
            {/* Hero */}
            <section className="relative min-h-screen flex items-center overflow-hidden bg-brand-black">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-black via-brand-gray to-brand-black opacity-90" />
                {/* Decorative grid */}
                <div className="absolute inset-0 opacity-5"
                    style={{ backgroundImage: 'linear-gradient(#d4ff00 1px, transparent 1px), linear-gradient(90deg, #d4ff00 1px, transparent 1px)', backgroundSize: '60px 60px' }}
                />
                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <div className="max-w-4xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent mb-6 animate-fade-in">
                            New Collection 2026
                        </p>
                        <h1 className="font-display text-[clamp(4rem,12vw,10rem)] leading-none uppercase text-brand-white animate-slide-up">
                            Dress The<br />
                            <span className="text-gradient">Pulse</span>
                        </h1>
                        <p className="mt-8 text-brand-muted text-base md:text-lg max-w-md leading-relaxed animate-fade-in">
                            Premium streetwear for those who move differently. Every drop is a statement.
                        </p>
                        <div className="mt-10 flex flex-wrap gap-4 animate-fade-in">
                            <Link to="/products" className="btn-primary text-sm px-8 py-4">
                                Shop Now <HiArrowRight size={16} />
                            </Link>
                            <Link to="/products" className="btn-secondary text-sm px-8 py-4">
                                Explore Drops
                            </Link>
                        </div>
                    </div>
                </div>
                {/* Bottom gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-brand-black to-transparent" />
            </section>

            {/* Active Offers Banner */}
            {offers.length > 0 && (
                <section className="bg-brand-accent py-3 overflow-hidden">
                    <div className="flex gap-12 animate-pulse-slow">
                        {[...offers, ...offers, ...offers].map((offer, i) => (
                            <span key={i} className="whitespace-nowrap text-brand-black text-xs font-black uppercase tracking-widest">
                                {offer.title} — {offer.discountPercentage}% OFF &nbsp;★&nbsp;
                            </span>
                        ))}
                    </div>
                </section>
            )}

            {/* Categories */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12">
                    <h2 className="font-display text-5xl md:text-6xl uppercase text-brand-white">Categories</h2>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {categories.map((cat) => (
                        <Link
                            key={cat}
                            to={`/products?category=${cat}`}
                            className="group relative overflow-hidden bg-brand-gray border border-brand-border hover:border-brand-accent transition-all duration-300 aspect-square flex items-end p-6"
                        >
                            <div className="absolute inset-0 bg-gradient-to-t from-brand-black/80 to-transparent" />
                            <div className="relative z-10">
                                <h3 className="font-display text-2xl uppercase text-brand-white group-hover:text-brand-accent transition-colors">
                                    {cat}
                                </h3>
                                <p className="text-brand-muted text-xs mt-1 flex items-center gap-1 group-hover:text-brand-white transition-colors">
                                    Shop Now <HiArrowRight size={12} />
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-end justify-between mb-12">
                    <h2 className="font-display text-5xl md:text-6xl uppercase text-brand-white">
                        Featured
                    </h2>
                    <Link to="/products" className="text-xs font-semibold uppercase tracking-widest text-brand-accent hover:text-white transition-colors flex items-center gap-2">
                        View All <HiArrowRight size={14} />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center py-24"><Loader size="lg" /></div>
                ) : featured.length === 0 ? (
                    <div className="text-center py-24 text-brand-muted">
                        <p className="text-5xl mb-4">👕</p>
                        <p className="text-sm uppercase tracking-widest">No products yet. Check back soon!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {featured.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </section>

            {/* Brand Statement */}
            <section className="py-32 bg-brand-gray border-y border-brand-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <p className="text-xs font-semibold uppercase tracking-[0.3em] text-brand-accent mb-6">Our Promise</p>
                    <h2 className="font-display text-[clamp(3rem,8vw,7rem)] uppercase text-brand-white leading-none">
                        Quality Over<br />Everything
                    </h2>
                    <p className="mt-8 text-brand-muted max-w-lg mx-auto text-base leading-relaxed">
                        100% premium cotton. Ethical sourcing. Drops that matter. PULSEPR isn't just clothing — it's a movement.
                    </p>
                </div>
            </section>
        </div>
    )
}
