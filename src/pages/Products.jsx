import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { getAllProducts, searchProducts, getProductsByCategory } from '../api/services'
import ProductCard from '../components/ProductCard'
import Loader from '../components/Loader'
import { HiSearch, HiX } from 'react-icons/hi'

const CATEGORIES = ['All', 'Oversized', 'Regular', 'Graphic Tee', 'Hoodie']

export default function Products() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [filtered, setFiltered] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || 'All')
    const [sort, setSort] = useState('default')

    const fetchProducts = useCallback(async () => {
        setLoading(true)
        try {
            const cat = activeCategory !== 'All' ? activeCategory : null
            const res = cat
                ? await getProductsByCategory(cat)
                : await getAllProducts()
            setProducts(res.data.products || [])
        } finally {
            setLoading(false)
        }
    }, [activeCategory])

    useEffect(() => { fetchProducts() }, [fetchProducts])

    // Client-side search + sort
    useEffect(() => {
        let result = [...products]
        if (search.trim()) {
            result = result.filter(
                (p) =>
                    p.name.toLowerCase().includes(search.toLowerCase()) ||
                    p.category?.toLowerCase().includes(search.toLowerCase())
            )
        }
        if (sort === 'asc') result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
        if (sort === 'desc') result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
        setFiltered(result)
    }, [products, search, sort])

    const handleCategory = (cat) => {
        setActiveCategory(cat)
        setSearch('')
        setSearchParams(cat !== 'All' ? { category: cat } : {})
    }

    const handleSearch = async (val) => {
        setSearch(val)
        if (val.trim().length > 2) {
            try {
                const res = await searchProducts(val)
                setProducts(res.data.products || [])
            } catch { /* fallback to client filter */ }
        } else if (val.trim() === '') {
            fetchProducts()
        }
    }

    return (
        <div className="min-h-screen pt-20 page-enter">
            {/* Header */}
            <div className="border-b border-brand-border bg-brand-gray/30">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <h1 className="font-display text-6xl md:text-8xl uppercase text-brand-white">Shop</h1>
                    <p className="text-brand-muted text-sm mt-2">{filtered.length} products</p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8">
                    {/* Search */}
                    <div className="relative flex-1 max-w-sm">
                        <HiSearch size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-muted" />
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                            placeholder="Search products..."
                            className="input-field pl-10 pr-10"
                        />
                        {search && (
                            <button onClick={() => { setSearch(''); fetchProducts() }} className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-white">
                                <HiX size={16} />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <select
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="input-field max-w-[180px] cursor-pointer"
                    >
                        <option value="default">Sort: Default</option>
                        <option value="asc">Price: Low → High</option>
                        <option value="desc">Price: High → Low</option>
                    </select>
                </div>

                {/* Categories */}
                <div className="flex gap-2 flex-wrap mb-10">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => handleCategory(cat)}
                            className={`text-xs font-semibold uppercase tracking-widest px-4 py-2 border transition-all duration-200 ${activeCategory === cat
                                    ? 'bg-brand-accent text-brand-black border-brand-accent'
                                    : 'border-brand-border text-brand-muted hover:border-brand-white hover:text-brand-white'
                                }`}
                        >
                            {cat}
                        </button>
                    ))}
                </div>

                {/* Grid */}
                {loading ? (
                    <div className="flex justify-center py-32"><Loader size="lg" /></div>
                ) : filtered.length === 0 ? (
                    <div className="text-center py-32">
                        <p className="text-5xl mb-4">🔍</p>
                        <p className="text-brand-muted text-sm uppercase tracking-widest">No products found</p>
                        <button onClick={() => { setSearch(''); handleCategory('All') }} className="btn-secondary mt-6 text-xs">
                            Clear Filters
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {filtered.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
