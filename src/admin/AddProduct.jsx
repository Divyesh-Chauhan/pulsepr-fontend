import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminUploadImages, adminAddProduct } from '../api/services'
import toast from 'react-hot-toast'
import { HiArrowLeft, HiPlus, HiTrash, HiUpload } from 'react-icons/hi'

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']
const CATEGORIES = ['Oversized', 'Regular', 'Graphic Tee', 'Hoodie']
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000'

const defaultSizes = SIZES.map((s) => ({ size: s, stockQuantity: 0 }))

export default function AddProduct() {
    const navigate = useNavigate()
    const [form, setForm] = useState({
        name: '',
        brand: 'PULSEPR',
        description: '',
        price: '',
        discountPrice: '',
        category: 'Oversized',
        isActive: true,
    })
    const [sizes, setSizes] = useState(defaultSizes)
    const [images, setImages] = useState([]) // uploaded URL strings
    const [uploading, setUploading] = useState(false)
    const [saving, setSaving] = useState(false)

    // Handle image upload
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

    const updateSize = (index, field, value) => {
        setSizes((prev) => prev.map((s, i) => i === index ? { ...s, [field]: field === 'stockQuantity' ? Number(value) : value } : s))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.price || !form.category) { toast.error('Fill required fields'); return }
        if (images.length === 0) { toast.error('Upload at least one image'); return }
        setSaving(true)
        try {
            await adminAddProduct({
                ...form,
                price: Number(form.price),
                discountPrice: form.discountPrice ? Number(form.discountPrice) : undefined,
                images,
                sizes,
            })
            toast.success('Product created!')
            navigate('/admin/products')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create product')
        } finally {
            setSaving(false)
        }
    }

    return (
        <div className="animate-fade-in max-w-3xl">
            <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-brand-muted hover:text-brand-white text-xs font-semibold uppercase tracking-widest mb-8 transition-colors">
                <HiArrowLeft size={16} /> Back
            </button>
            <h1 className="font-display text-5xl uppercase text-brand-white mb-8">Add Product</h1>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Info */}
                <div className="card p-6 space-y-5">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-2">Product Info</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label">Product Name *</label>
                            <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Classic Oversized Tee" required />
                        </div>
                        <div>
                            <label className="label">Brand</label>
                            <input value={form.brand} onChange={(e) => setForm({ ...form, brand: e.target.value })} className="input-field" />
                        </div>
                        <div>
                            <label className="label">Category *</label>
                            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="input-field cursor-pointer">
                                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="label">Price (₹) *</label>
                            <input type="number" min="0" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="input-field" placeholder="999" required />
                        </div>
                        <div>
                            <label className="label">Discount Price (₹)</label>
                            <input type="number" min="0" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="input-field" placeholder="799" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="label">Description</label>
                            <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="input-field resize-none" placeholder="Premium 100% cotton..." />
                        </div>
                        <div className="flex items-center gap-3">
                            <input type="checkbox" id="isActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-brand-accent" />
                            <label htmlFor="isActive" className="text-xs font-semibold uppercase tracking-widest text-brand-muted cursor-pointer">Active (visible on store)</label>
                        </div>
                    </div>
                </div>

                {/* Image Upload */}
                <div className="card p-6">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-4">Product Images *</h2>
                    <label className="flex flex-col items-center gap-3 border-2 border-dashed border-brand-border hover:border-brand-accent transition-colors p-8 cursor-pointer">
                        <HiUpload size={28} className="text-brand-muted" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-brand-muted">
                            {uploading ? 'Uploading...' : 'Click to Upload Images (max 10)'}
                        </span>
                        <input type="file" accept="image/*" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} />
                    </label>
                    {images.length > 0 && (
                        <div className="grid grid-cols-4 gap-3 mt-4">
                            {images.map((url) => (
                                <div key={url} className="relative group aspect-square overflow-hidden bg-brand-black">
                                    <img src={url.startsWith('http') ? url : `${API_URL}${url}`} alt="" className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(url)}
                                        className="absolute inset-0 bg-black/60 hidden group-hover:flex items-center justify-center text-red-500"
                                    >
                                        <HiTrash size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Sizes & Stock */}
                <div className="card p-6">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-4">Sizes & Stock</h2>
                    <div className="space-y-3">
                        {sizes.map((s, i) => (
                            <div key={s.size} className="flex items-center gap-4">
                                <span className="text-xs font-bold uppercase tracking-widest text-brand-white w-10">{s.size}</span>
                                <input
                                    type="number"
                                    min="0"
                                    value={s.stockQuantity}
                                    onChange={(e) => updateSize(i, 'stockQuantity', e.target.value)}
                                    className="input-field max-w-[120px]"
                                    placeholder="Stock qty"
                                />
                                <span className="text-xs text-brand-muted">{s.stockQuantity > 0 ? `${s.stockQuantity} units` : 'Out of stock'}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Submit */}
                <div className="flex gap-4">
                    <button type="submit" disabled={saving || uploading} className="btn-primary disabled:opacity-60">
                        {saving ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <HiPlus size={16} />}
                        {saving ? 'Creating...' : 'Create Product'}
                    </button>
                    <button type="button" onClick={() => navigate('/admin/products')} className="btn-secondary">Cancel</button>
                </div>
            </form>
        </div>
    )
}
