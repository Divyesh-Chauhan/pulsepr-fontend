import { useState, useEffect } from 'react'
import { adminGetOffers, adminCreateOffer, adminApplyOffer } from '../api/services'
import Loader from '../components/Loader'
import toast from 'react-hot-toast'
import { HiPlus, HiTag, HiLightningBolt } from 'react-icons/hi'

const CATEGORIES = ['All Products', 'Oversized', 'Regular', 'Graphic Tee', 'Hoodie']

const defaultForm = {
    title: '',
    discountPercentage: '',
    startDate: '',
    endDate: '',
    isActive: true,
}

export default function OffersAdmin() {
    const [offers, setOffers] = useState([])
    const [loading, setLoading] = useState(true)
    const [creating, setCreating] = useState(false)
    const [applying, setApplying] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState(defaultForm)
    const [applyConfig, setApplyConfig] = useState({ offerId: '', category: 'All Products' })

    const fetchOffers = () => {
        adminGetOffers()
            .then((res) => setOffers(res.data.offers || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }

    useEffect(() => { fetchOffers() }, [])

    const handleCreate = async (e) => {
        e.preventDefault()
        if (!form.title || !form.discountPercentage || !form.startDate || !form.endDate) {
            toast.error('Please fill all fields')
            return
        }
        setCreating(true)
        try {
            const res = await adminCreateOffer({
                ...form,
                discountPercentage: Number(form.discountPercentage),
            })
            toast.success('Offer created!')
            setOffers((prev) => [res.data.offer, ...prev])
            setForm(defaultForm)
            setShowForm(false)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to create offer')
        } finally {
            setCreating(false)
        }
    }

    const handleApply = async (offerId) => {
        const cat = applyConfig.category
        setApplying(offerId)
        try {
            const body = { offerId }
            if (cat !== 'All Products') body.category = cat
            await adminApplyOffer(body)
            toast.success(`Offer applied to ${cat}!`)
        } catch (err) {
            toast.error(err.response?.data?.message || 'Apply failed')
        } finally {
            setApplying(null)
        }
    }

    if (loading) return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="font-display text-5xl uppercase text-brand-white">Offers</h1>
                    <p className="text-brand-muted text-sm mt-1">{offers.length} offers</p>
                </div>
                <button onClick={() => setShowForm(!showForm)} className="btn-primary">
                    <HiPlus size={16} /> Create Offer
                </button>
            </div>

            {/* Create Form */}
            {showForm && (
                <div className="card p-6 mb-8 animate-slide-up">
                    <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-5">New Offer</h2>
                    <form onSubmit={handleCreate} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="label">Offer Title</label>
                            <input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="input-field" placeholder="Summer Sale 2026" required />
                        </div>
                        <div>
                            <label className="label">Discount (%)</label>
                            <input type="number" min="1" max="100" value={form.discountPercentage} onChange={(e) => setForm({ ...form, discountPercentage: e.target.value })} className="input-field" placeholder="20" required />
                        </div>
                        <div className="flex items-center gap-3 pt-6">
                            <input type="checkbox" id="offerActive" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="w-4 h-4 accent-brand-accent" />
                            <label htmlFor="offerActive" className="text-xs font-semibold uppercase tracking-widest text-brand-muted cursor-pointer">Active</label>
                        </div>
                        <div>
                            <label className="label">Start Date</label>
                            <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="input-field" required />
                        </div>
                        <div>
                            <label className="label">End Date</label>
                            <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} className="input-field" required />
                        </div>
                        <div className="md:col-span-2 flex gap-3">
                            <button type="submit" disabled={creating} className="btn-primary disabled:opacity-60">
                                {creating ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <HiTag size={16} />}
                                {creating ? 'Creating...' : 'Create Offer'}
                            </button>
                            <button type="button" onClick={() => setShowForm(false)} className="btn-secondary">Cancel</button>
                        </div>
                    </form>
                </div>
            )}

            {/* Apply Offer to Products */}
            <div className="card p-6 mb-8">
                <h2 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-4">Apply Offer to Products</h2>
                <p className="text-brand-muted text-xs mb-4">Selecting an offer will update discount prices on all matching products.</p>
                <div className="flex flex-wrap gap-4 items-end">
                    <div>
                        <label className="label">Select Offer</label>
                        <select
                            value={applyConfig.offerId}
                            onChange={(e) => setApplyConfig({ ...applyConfig, offerId: e.target.value })}
                            className="input-field min-w-[200px] cursor-pointer"
                        >
                            <option value="">-- Choose offer --</option>
                            {offers.map((o) => (
                                <option key={o.id} value={o.id}>{o.title} ({o.discountPercentage}%)</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="label">Apply To</label>
                        <select
                            value={applyConfig.category}
                            onChange={(e) => setApplyConfig({ ...applyConfig, category: e.target.value })}
                            className="input-field min-w-[160px] cursor-pointer"
                        >
                            {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <button
                        onClick={() => applyConfig.offerId ? handleApply(Number(applyConfig.offerId)) : toast.error('Select an offer')}
                        disabled={!!applying}
                        className="btn-primary disabled:opacity-60"
                    >
                        {applying ? <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" /> : <HiLightningBolt size={16} />}
                        {applying ? 'Applying...' : 'Apply Now'}
                    </button>
                </div>
            </div>

            {/* Offers List */}
            {offers.length === 0 ? (
                <div className="text-center py-16 card">
                    <HiTag size={40} className="mx-auto text-brand-border mb-4" />
                    <p className="text-brand-muted text-sm uppercase tracking-widest">No offers yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {offers.map((offer) => (
                        <div key={offer.id} className={`card p-5 flex flex-col gap-3 border ${offer.isActive ? 'border-brand-accent/30' : 'border-brand-border'}`}>
                            <div className="flex items-start justify-between gap-2">
                                <h3 className="text-sm font-bold text-brand-white">{offer.title}</h3>
                                <span className={`status-badge border flex-shrink-0 ${offer.isActive ? 'bg-green-500/10 text-green-400 border-green-500/30' : 'bg-red-500/10 text-red-400 border-red-500/30'}`}>
                                    {offer.isActive ? 'Active' : 'Inactive'}
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="font-display text-4xl text-brand-accent">{offer.discountPercentage}%</span>
                                <span className="text-brand-muted text-xs uppercase tracking-widest">OFF</span>
                            </div>
                            <div className="text-xs text-brand-muted space-y-1">
                                <p>From: {new Date(offer.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                                <p>To: {new Date(offer.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
