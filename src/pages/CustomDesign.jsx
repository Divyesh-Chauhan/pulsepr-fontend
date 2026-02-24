import { useState, useEffect } from 'react'
import { uploadDesign, getMyDesigns, deleteDesign } from '../api/services'
import { HiOutlineUpload, HiOutlineTrash, HiOutlinePhotograph } from 'react-icons/hi'
import toast from 'react-hot-toast'
import Loader from '../components/Loader'

export default function CustomDesign() {
    const [designs, setDesigns] = useState([])
    const [loading, setLoading] = useState(true)
    const [uploading, setUploading] = useState(false)
    const [file, setFile] = useState(null)
    const [formData, setFormData] = useState({ note: '', printSize: '', quantity: 1 })

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

    const handleUpload = async (e) => {
        e.preventDefault()
        if (!file) return toast.error('Please select an image file first')

        const data = new FormData()
        data.append('design', file)
        data.append('note', formData.note)
        data.append('printSize', formData.printSize)
        data.append('quantity', formData.quantity)

        try {
            setUploading(true)
            await uploadDesign(data)
            toast.success('Design uploaded successfully!')
            setFile(null)
            setFormData({ note: '', printSize: '', quantity: 1 })
            fetchDesigns()
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to upload design')
        } finally {
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
                        <form onSubmit={handleUpload} className="space-y-6">
                            <div>
                                <label className="label">Upload Image</label>
                                <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-brand-border border-dashed rounded-md hover:border-brand-accent transition-colors">
                                    <div className="space-y-1 text-center">
                                        <HiOutlineUpload className="mx-auto h-12 w-12 text-brand-muted" />
                                        <div className="flex text-sm text-brand-muted justify-center">
                                            <label className="relative cursor-pointer rounded-md font-medium text-brand-accent hover:text-brand-white focus-within:outline-none">
                                                <span>Upload a file</span>
                                                <input id="file-upload" type="file" className="sr-only" accept="image/*" onChange={(e) => setFile(e.target.files[0])} />
                                            </label>
                                        </div>
                                        {file && <p className="text-xs text-brand-white mt-2">{file.name}</p>}
                                    </div>
                                </div>
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
                                <label className="label">Special Instructions / Note</label>
                                <textarea
                                    className="input-field min-h-[100px]"
                                    placeholder="Any specific instructions for your design?"
                                    value={formData.note}
                                    onChange={(e) => setFormData({ ...formData, note: e.target.value })}
                                />
                            </div>

                            <button type="submit" disabled={uploading || !file} className="btn-primary w-full justify-center py-3 text-sm">
                                {uploading ? 'Uploading...' : 'Submit Design'}
                            </button>
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
