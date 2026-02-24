import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { adminGetAllDesigns, adminUpdateDesignStatus } from '../api/services'
import Loader from '../components/Loader'
import { HiOutlinePhotograph, HiOutlineCheck, HiOutlineX, HiOutlinePlus } from 'react-icons/hi'
import toast from 'react-hot-toast'

export default function DesignsAdmin() {
    const navigate = useNavigate()
    const [designs, setDesigns] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedDesign, setSelectedDesign] = useState(null)
    const [adminNote, setAdminNote] = useState('')

    useEffect(() => {
        fetchDesigns()
    }, [])

    const fetchDesigns = async () => {
        try {
            setLoading(true)
            const res = await adminGetAllDesigns()
            setDesigns(res.data.designs || [])
        } catch (err) {
            console.error('Failed to fetch designs', err)
            toast.error('Failed to load custom designs')
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateStatus = async (id, status) => {
        try {
            await adminUpdateDesignStatus(id, status, adminNote)
            toast.success(`Design marked as ${status}`)
            fetchDesigns()
            if (selectedDesign && selectedDesign.id === id) {
                setSelectedDesign((prev) => ({ ...prev, status }))
            }
            setAdminNote('')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update status')
        }
    }

    const handleAddToShop = () => {
        if (!selectedDesign) return

        let title = `Custom Design #${selectedDesign.userId}`
        let noteDesc = selectedDesign.note || ''

        if (selectedDesign.note && selectedDesign.note.includes('Title:')) {
            const titleMatch = selectedDesign.note.match(/Title:\s*(.*?)\s*\|/)
            if (titleMatch) title = titleMatch[1]
        }

        navigate('/admin/product/add', {
            state: {
                form: {
                    name: title,
                    brand: 'PULSEPR',
                    description: `Converted from Custom Design.\nPrint Size: ${selectedDesign.printSize || 'N/A'}\nUser Note: ${noteDesc}`,
                    price: '999',
                    discountPrice: '799',
                    category: 'Graphic Tee',
                    isActive: true,
                },
                images: [selectedDesign.imageUrl],
            },
        })
    }

    if (loading) return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>

    return (
        <div className="animate-fade-in">
            <h1 className="font-display text-4xl uppercase text-brand-white mb-8">Custom Designs</h1>

            {designs.length === 0 ? (
                <div className="text-center py-20 bg-brand-gray border border-brand-border">
                    <HiOutlinePhotograph size={48} className="mx-auto text-brand-muted mb-4 opacity-50" />
                    <p className="text-brand-muted text-sm uppercase tracking-widest">No custom designs uploaded yet</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* List of Designs */}
                    <div className="lg:col-span-2 space-y-4">
                        {designs.map((design) => (
                            <div
                                key={design.id}
                                onClick={() => setSelectedDesign(design)}
                                className={`bg-brand-gray border p-4 flex gap-4 cursor-pointer transition-colors ${selectedDesign?.id === design.id ? 'border-brand-accent' : 'border-brand-border hover:border-brand-muted'
                                    }`}
                            >
                                <img src={design.imageUrl} alt="Design" className="w-24 h-24 object-cover border border-brand-border" />
                                <div className="flex-1">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-bold text-brand-white uppercase">
                                            User ID: {design.userId}
                                        </p>
                                        <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${design.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-500' :
                                            design.status === 'Reviewed' ? 'bg-blue-500/20 text-blue-500' :
                                                design.status === 'InProduction' ? 'bg-purple-500/20 text-purple-500' :
                                                    design.status === 'Completed' ? 'bg-green-500/20 text-green-500' :
                                                        'bg-red-500/20 text-red-500'
                                            }`}>
                                            {design.status}
                                        </span>
                                    </div>
                                    <div className="text-xs text-brand-muted space-y-1">
                                        <p>Date: {new Date(design.createdAt).toLocaleDateString()}</p>
                                        <p>Print Size: {design.printSize || 'N/A'}</p>
                                        <p>Quantity: {design.quantity}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Details Panel */}
                    <div className="lg:col-span-1">
                        {selectedDesign ? (
                            <div className="bg-brand-gray border border-brand-border p-6 sticky top-6">
                                <h2 className="text-lg font-display text-brand-white uppercase mb-4">Design Details</h2>

                                <a href={selectedDesign.imageUrl} target="_blank" rel="noopener noreferrer" className="block mb-4">
                                    <img src={selectedDesign.imageUrl} alt="Design full" className="w-full h-auto border border-brand-border hover:opacity-80 transition-opacity" />
                                </a>

                                <div className="space-y-4 text-sm">
                                    <div>
                                        <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-1">User Note</p>
                                        <p className="text-brand-white bg-brand-black p-3 rounded">{selectedDesign.note || 'No notes provided by user.'}</p>
                                    </div>

                                    <div>
                                        <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-1">Specs</p>
                                        <p className="text-brand-white">Size: {selectedDesign.printSize || 'N/A'} | Qty: {selectedDesign.quantity}</p>
                                    </div>

                                    <div className="pt-4 border-t border-brand-border">
                                        <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-2">Update Status</p>

                                        <select
                                            className="input-field mb-4 cursor-pointer"
                                            value={selectedDesign.status}
                                            onChange={(e) => handleUpdateStatus(selectedDesign.id, e.target.value)}
                                        >
                                            <option value="Pending">Pending</option>
                                            <option value="Reviewed">Reviewed</option>
                                            <option value="InProduction">In Production</option>
                                            <option value="Completed">Completed</option>
                                            <option value="Rejected">Rejected</option>
                                        </select>

                                        <p className="text-[10px] text-brand-muted uppercase tracking-widest mb-2">Admin Note (Sent to User)</p>
                                        <textarea
                                            className="input-field min-h-[80px] mb-4"
                                            placeholder="Write a message to the user..."
                                            value={adminNote}
                                            onChange={(e) => setAdminNote(e.target.value)}
                                        />

                                        <button
                                            onClick={() => handleUpdateStatus(selectedDesign.id, selectedDesign.status)}
                                            className="btn-primary w-full justify-center text-xs mb-4"
                                        >
                                            Save Changes
                                        </button>

                                        {selectedDesign.status === 'Completed' && (
                                            <button
                                                onClick={handleAddToShop}
                                                className="btn-secondary w-full justify-center text-xs flex items-center gap-2 border-brand-accent text-brand-accent hover:bg-brand-accent hover:text-brand-black"
                                            >
                                                <HiOutlinePlus size={14} /> Add to Shop Product
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="bg-brand-gray border border-brand-border p-6 text-center text-brand-muted h-full flex flex-col justify-center items-center">
                                <HiOutlinePhotograph size={32} className="mb-2 opacity-50" />
                                <p className="text-sm">Select a design to view details and update status.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}
