import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminGetProducts, adminDeleteProduct } from '../api/services'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { HiOutlinePencil, HiOutlineTrash, HiPlus } from 'react-icons/hi'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'
function getImageUrl(url) {
    if (!url) return null
    if (url.startsWith('http')) return url
    return `${API_URL}${url}`
}

export default function ProductsList() {
    const [products, setProducts] = useState([])
    const [loading, setLoading] = useState(true)
    const [deletingId, setDeletingId] = useState(null)

    const fetch = async () => {
        try {
            setLoading(true)
            const res = await adminGetProducts()
            setProducts(res.data.products || [])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetch() }, [])

    const handleDelete = async (id, name) => {
        if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return
        setDeletingId(id)
        try {
            await adminDeleteProduct(id)
            toast.success('Product deleted')
            setProducts((prev) => prev.filter((p) => p.id !== id))
        } catch (err) {
            toast.error(err.response?.data?.message || 'Delete failed')
        } finally {
            setDeletingId(null)
        }
    }

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-5xl uppercase text-brand-white">Products</h1>
                    <p className="text-brand-muted text-sm mt-1">{products.length} total products</p>
                </div>
                <Link to="/admin/products/add" className="btn-primary">
                    <HiPlus size={16} /> Add Product
                </Link>
            </div>

            {loading ? (
                <div className="flex justify-center py-24"><Loader size="lg" /></div>
            ) : products.length === 0 ? (
                <div className="text-center py-24 card">
                    <p className="text-brand-muted text-sm uppercase tracking-widest">No products found</p>
                    <Link to="/admin/products/add" className="btn-primary mt-4 inline-flex">Add First Product</Link>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-brand-border bg-brand-black">
                                <tr>
                                    {['Product', 'Category', 'Price', 'Status', 'Sizes', 'Actions'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-brand-muted whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                                {products.map((p) => {
                                    const img = p.images?.[0]?.imageUrl || p.images?.[0]
                                    return (
                                        <tr key={p.id} className="hover:bg-brand-black/30 transition-colors">
                                            {/* Product */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-12 flex-shrink-0 bg-brand-black overflow-hidden">
                                                        {img ? (
                                                            <img src={getImageUrl(img)} alt={p.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <div className="w-full h-full flex items-center justify-center font-display text-xs text-brand-border">PP</div>
                                                        )}
                                                    </div>
                                                    <div className="min-w-0">
                                                        <p className="text-sm font-semibold text-brand-white truncate max-w-[160px]">{p.name}</p>
                                                        <p className="text-[10px] text-brand-muted">#{p.id}</p>
                                                    </div>
                                                </div>
                                            </td>
                                            {/* Category */}
                                            <td className="px-4 py-3">
                                                <span className="text-xs text-brand-muted">{p.category}</span>
                                            </td>
                                            {/* Price */}
                                            <td className="px-4 py-3">
                                                <p className="text-sm font-bold text-brand-white">₹{(p.discountPrice || p.price).toLocaleString()}</p>
                                                {p.discountPrice && p.discountPrice < p.price && (
                                                    <p className="text-[10px] text-brand-muted line-through">₹{p.price.toLocaleString()}</p>
                                                )}
                                            </td>
                                            {/* Status */}
                                            <td className="px-4 py-3">
                                                <span className={`status-badge border ${p.isActive ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                                                    {p.isActive ? 'Active' : 'Inactive'}
                                                </span>
                                            </td>
                                            {/* Sizes */}
                                            <td className="px-4 py-3">
                                                <div className="flex gap-1 flex-wrap">
                                                    {p.sizes?.map((s) => (
                                                        <span key={s.id} className={`text-[9px] font-bold px-1.5 py-0.5 border ${s.stockQuantity > 0 ? 'border-brand-border text-brand-muted' : 'border-red-500/30 text-red-500/50'
                                                            }`}>
                                                            {s.size}
                                                        </span>
                                                    ))}
                                                </div>
                                            </td>
                                            {/* Actions */}
                                            <td className="px-4 py-3">
                                                <div className="flex items-center gap-2">
                                                    <Link
                                                        to={`/admin/products/edit/${p.id}`}
                                                        className="p-1.5 text-brand-muted hover:text-brand-accent transition-colors"
                                                        title="Edit"
                                                    >
                                                        <HiOutlinePencil size={16} />
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(p.id, p.name)}
                                                        disabled={deletingId === p.id}
                                                        className="p-1.5 text-brand-muted hover:text-red-500 transition-colors disabled:opacity-40"
                                                        title="Delete"
                                                    >
                                                        {deletingId === p.id ? (
                                                            <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin inline-block" />
                                                        ) : (
                                                            <HiOutlineTrash size={16} />
                                                        )}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
