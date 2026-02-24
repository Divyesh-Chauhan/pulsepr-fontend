import { useState, useEffect } from 'react'
import { uploadDesign, getMyDesigns, deleteDesign } from '../api/services'
import { useAuth } from '../context/AuthContext'
import { HiOutlineUpload, HiOutlineTrash, HiOutlinePhotograph, HiOutlineLockClosed } from 'react-icons/hi'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'

export default function CustomDesign() {
    const { user } = useAuth()
    const [designs, setDesigns] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [file, setFile] = useState(null)
    const [formData, setFormData] = useState({ title: '', tshirtSize: '', address: '', note: '', printSize: '', quantity: 1 })

    const handleDragOver = (e) => {
        e.preventDefault()
    }

    const handleDrop = (e) => {
        e.preventDefault()
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            setFile(e.dataTransfer.files[0])
        }
    }

    useEffect(() => {
        fetchDesigns()
    }, [])

    const fetchDesigns = async () => {
        try {
            setLoading(true)
            const res = await getMyDesigns()
            setDesigns(res.data.designs || [])
        } catch (err) {
            console.error('Failed to fetch designs', err)
        } finally {
            setLoading(false)
        }
    }

    const handlePaymentAndUpload = async (e) => {
        e.preventDefault()
        if (!file) return toast.error('Please select an image file first')
        if (!formData.title.trim()) return toast.error('Please enter a title')
        if (!formData.tshirtSize) return toast.error('Please select a T-Shirt size')
        if (!formData.address.trim()) return toast.error('Please enter an address')

        setUploading(true)

        const options = {
            key: import.meta.env.VITE_RAZORPAY_KEY_ID,
            amount: 509 * 100, // 400 (T-shirt) + 30 (Design) + 79 (Shipping)
            currency: 'INR',
            name: 'PULSEPR',
            description: 'Custom Design Fee (T-Shirt + Design + Shipping)',
            prefill: {
                name: user?.name,
                email: user?.email,
            },
            theme: { color: '#d4ff00' },
            handler: async (response) => {
                const mergedNote = `Title: ${formData.title} | T-Shirt: ${formData.tshirtSize} | Address: ${formData.address} | Note: ${formData.note} | PaymentID: ${response.razorpay_payment_id}`

                const data = new FormData()
                data.append('design', file)
                data.append('note', mergedNote)
                data.append('printSize', formData.printSize)
                data.append('quantity', formData.quantity)

                try {
                    await uploadDesign(data)
                    toast.success('Payment successful & Design uploaded!')
                    setFile(null)
                    setFormData({ title: '', tshirtSize: '', address: '', note: '', printSize: '', quantity: 1 })
                    fetchDesigns()
                } catch (err) {
                    toast.error(err.response?.data?.message || 'Failed to upload design after payment')
                } finally {
                    setUploading(false)
                }
            },
            modal: {
                ondismiss: () => {
                    toast.error('Payment cancelled')
                    setUploading(false)
                },
            },
        }

        try {
            const rzp = new window.Razorpay(options)
            rzp.on('payment.failed', () => {
                toast.error('Payment failed. Please try again.')
                setUploading(false)
            })
            rzp.open()
        } catch (err) {
            toast.error('Could not initiate Razorpay. Please make sure script is loaded.')
            setUploading(false)
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this design?')) return
        try {
            await deleteDesign(id)
            toast.success('Design deleted')
            fetchDesigns()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to delete design')
        }
    }

    if (loading) return <div className="min-h-screen pt-20 flex items-center justify-center"><Loader size="lg" /></div>

    return (
        <div className="min-h-screen pt-20 page-enter">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <h1 className="font-display text-4xl text-brand-white uppercase mb-8">Custom Designs</h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Upload Form */}
                    <div className="bg-brand-gray border border-brand-border p-6 rounded-md">
                        <h2 className="text-xl font-display text-brand-white uppercase mb-6">Upload New Design</h2>
                        <form onSubmit={handlePaymentAndUpload} className="space-y-6">
                            <div>
                                <label className="label">Upload Image</label>
                                <label
                                    onDragOver={handleDragOver}
                                    onDrop={handleDrop}
                                    className="mt-1 flex justify-center px-6 pt-10 pb-10 border-2 border-brand-border border-dashed rounded-md hover:border-brand-accent transition-colors cursor-pointer group"
                                >
                                    <div className="space-y-1 text-center">
                                        <HiOutlineUpload className={`mx-auto h-12 w-12 transition-colors ${file ? 'text-brand-accent' : 'text-brand-muted group-hover:text-brand-accent'}`} />
                                        <div className="flex flex-col text-sm text-brand-muted justify-center items-center mt-2">
                                            <span className="font-medium text-brand-accent group-hover:text-brand-white transition-colors">Click to upload or drag and drop</span>
                                            <span className="text-xs mt-1">SVG, PNG, JPG or GIF</span>
                                            <input type="file" className="sr-only" accept="image/*" onChange={(e) => { if (e.target.files[0]) setFile(e.target.files[0]) }} />
                                        </div>
                                        {file && <p className="text-sm font-bold text-brand-white mt-4" style={{ wordBreak: 'break-all' }}>{file.name}</p>}
                                    </div>
                                </label>
                            </div>

                            <div>
                                <label className="label">Title *</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="Enter a title for your design"
                                    value={formData.title}
                                    required
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="label">T-Shirt Size *</label>
                                <select
                                    className="input-field cursor-pointer"
                                    value={formData.tshirtSize}
                                    required
                                    onChange={(e) => setFormData({ ...formData, tshirtSize: e.target.value })}
                                >
                                    <option value="" disabled>Select a size</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                </select>
                            </div>

                            <div>
                                <label className="label">Print Size</label>
                                <input
                                    type="text"
                                    className="input-field"
                                    placeholder="e.g. A4, A3, 10x10 inches"
                                    value={formData.printSize}
                                    onChange={(e) => setFormData({ ...formData, printSize: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="label">Quantity</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="input-field"
                                    value={formData.quantity}
                                    onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 1 })}
                                />
                            </div>

                            <div>
                                <label className="label">Delivery Address *</label>
                                <textarea
                                    className="input-field resize-none min-h-[80px]"
                                    placeholder="Enter your complete delivery address"
                                    value={formData.address}
                                    required
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="label">Special Instructions / Note</label>
                                <textarea
                                    className="input-field min-h-[100px]"
                                    placeholder="Any specific instructions for your design?"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>

                            <button type="submit" disabled={uploading || !file} className="btn-primary w-full justify-center py-3 text-sm">
                                {uploading ? 'Processing...' : (
                                    <span className="flex items-center gap-2">
                                        <HiOutlineLockClosed size={16} /> Pay ₹509 & Submit
                                    </span>
                                )}
                            </button>
                            <p className="text-[10px] text-brand-muted text-center mt-2">
                                Fixed price: ₹400 (T-Shirt) + ₹30 (Design) + ₹79 (Shipping)
                            </p>
                        </form>
                    </div>

                    {/* My Designs List */}
                    <div>
                        <h2 className="text-xl font-display text-brand-white uppercase mb-6">Your Uploaded Designs</h2>
                        {designs.length === 0 ? (
                            <div className="p-8 border border-brand-border border-dashed flex flex-col items-center justify-center text-brand-muted">
                                <HiOutlinePhotograph size={48} className="mb-4 opacity-50" />
                                <p className="text-sm">You haven't uploaded any custom designs yet.</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {designs.map((design) => (
                                    <div key={design.id} className="bg-brand-gray border border-brand-border p-4 flex gap-4 items-center">
                                        <img src={design.imageUrl} alt="Design" className="w-20 h-20 object-cover border border-brand-border" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${design.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                                    design.status === 'Approved' ? 'bg-green-500/20 text-green-500' :
                                                        design.status === 'Rejected' ? 'bg-red-500/20 text-red-500' :
                                                            'bg-blue-500/20 text-blue-500'
                                                    }`}>
                                                    {design.status}
                                                </span>
                                                <span className="text-xs text-brand-muted">{new Date(design.createdAt).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-sm text-brand-white mb-1">Size: {design.printSize || 'N/A'} • Qty: {design.quantity}</p>
                                            {design.note && <p className="text-xs text-brand-muted line-clamp-1">{design.note}</p>}
                                        </div>
                                        {(design.status === 'Pending' || design.status === 'Rejected') && (
                                            <button onClick={() => handleDelete(design.id)} className="p-2 text-brand-muted hover:text-red-500 transition-colors">
                                                <HiOutlineTrash size={20} />
                                            </button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
