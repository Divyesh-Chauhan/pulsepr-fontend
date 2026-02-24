import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getProductById, adminUploadImages, adminUpdateProduct } from '../api/services'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { HiArrowLeft, HiSave, HiUpload, HiTrash } from 'react-icons/hi'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const CATEGORIES = ['Oversized', 'Regular', 'Graphic Tee', 'Hoodie']
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

export default function EditProduct() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [form, setForm] = useState({
        name: '', brand: 'PULSEPR', description: '', price: '', discountPrice: '', category: 'Oversized', isActive: true,
    })
    const [sizes, setSizes] = useState(SIZES.map((s) => ({ size: s, stockQuantity: 0 })))
    const [images, setImages] = useState([]) // url strings

    useEffect(() => {
        getProductById(id)
            .then((res) => {
                const p = res.data.product
                setForm({
                    name: p.name || '',
                    brand: p.brand || 'PULSEPR',
                    description: p.description || '',
                    price: p.price || '',
                    discountPrice: p.discountPrice || '',
                    category: p.category || 'Oversized',
                    isActive: p.isActive ?? true,
                })
                // Merge existing sizes
                const existingMap = {}
                p.sizes?.forEach((s) => { existingMap[s.size] = s.stockQuantity })
                setSizes(SIZES.map((s) => ({ size: s, stockQuantity: existingMap[s] ?? 0 })))
                setImages(p.images?.map((img) => img.imageUrl || img) || [])
            })
            .catch(() => { toast.error('Product not found'); navigate('/admin/products') })
            .finally(() => setLoading(false))
    }, [id, navigate])

    const handleImageUpload = async (e) => {
        const files = Array.from(e.target.files)
        if (!files.length) return
        const formData = new FormData()
        files.forEach((f) => formData.append('images', f))
        setUploading(true)
        try {
            const res = await adminUploadImages(formData)
            setImages((prev) => [...prev, ...(res.data.images || [])])
            toast.success('Images uploaded!')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Upload failed')
        } finally {
            setUploading(false)
        }
    }

    const removeImage = (url) => setImages((prev) => prev.filter((i) => i !== url))

    const updateSize = (index, value) => {
        setSizes((prev) => prev.map((s, i) => i === index ? { ...s, stockQuantity: Number(value) } : s))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            await adminUpdateProduct(id, {
                ...form,
                price: Number(form.price),
                discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
                images,
                sizes,
            })
            toast.success('Product updated!')
            navigate('/admin/products')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>

    return (
        <div className="animate-fade-in max-w-3xl">
            <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-brand-muted hover:text-brand-white text-xs font-semibold uppercase tracking-widest mb-8 transition-colors">
                <HiArrowLeft size={16} /> Back
            </button>
            <h1 className="font-display text-5xl uppercase text-brand-white mb-8">Edit Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="card p-6 space-y-4">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white">Product Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label">Product Name</label>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                            <label className="label">Brand</label>
                            <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
                        </div>
                        <div>
                            <label className="label">Category</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field cursor-pointer">
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Price (₹)</label>
                            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                            <label className="label">Discount Price (₹)</label>
                            <input type="number" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Description</label>
                            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" />
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-brand-accent" />
                            <label htmlFor="isActive" className="text-xs font-semibold uppercase tracking-widest text-brand-muted cursor-pointer">Active</label>
                        </div>
                    </div>
                </div>

                {/* Images */}
                <div className="card p-6">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-4">Images</h2>
                    {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mb-4">
                            {images.map((url) => (
                                <div key={url} className="relative group aspect-square overflow-hidden bg-brand-black">
                                    <img src={url.startsWith('http') ? url : `${API_URL}${url}`} alt="" className="w-full h-full object-cover" />
                                    <button type="button" onClick={() => removeImage(url)} className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-red-500">
                                        <HiTrash size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                    <label className="flex items-center gap-3 border border-dashed border-brand-border hover:border-brand-accent transition-colors p-4 cursor-pointer">
                        <HiUpload size={20} className="text-brand-muted" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                            {uploading ? 'Uploading...' : 'Add More Images'}
                        </span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                </div>

                {/* Sizes */}
                <div className="card p-6">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-4">Sizes & Stock</h2>
                    <div className="space-y-3">
                        {sizes.map((s, i) => (
                            <div key={s.size} className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-brand-white w-10">{s.size}</span>
                                <input type="number" min="0" value={s.stockQuantity} onChange={(e) => updateSize(i, e.target.value)} className="input-field max-w-[120px]" />
                                <span className="text-xs text-brand-muted">{s.stockQuantity > 0 ? `${s.stockQuantity} units` : 'Out of stock'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60">
                        {saving ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <HiSave size={16} />}
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    )
}
