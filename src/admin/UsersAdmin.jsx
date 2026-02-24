import { useState, useEffect } from 'react'
import { adminGetUsers } from '../api/services'
import Loader from '../components/Loader'
import { HiOutlineUsers } from 'react-icons/hi'

export default function UsersAdmin() {
    const [users, setUsers] = useState([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        adminGetUsers()
            .then((res) => setUsers(res.data.users || []))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    const filtered = users.filter(
        (u) =>
            u.name?.toLowerCase().includes(search.toLowerCase()) ||
            u.email?.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) return <div className="flex items-center justify-center h-64"><Loader size="lg" /></div>

    return (
        <div className="animate-fade-in">
            <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
                <div>
                    <h1 className="font-display text-5xl uppercase text-brand-white">Users</h1>
                    <p className="text-brand-muted text-sm mt-1">{users.length} total users</p>
                </div>
                <input
                    type="text"
                    placeholder="Search users..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="input-field max-w-[240px]"
                />
            </div>

            {filtered.length === 0 ? (
                <div className="text-center py-24 card">
                    <HiOutlineUsers size={48} className="mx-auto text-brand-border mb-4" />
                    <p className="text-brand-muted text-sm uppercase tracking-widest">No users found</p>
                </div>
            ) : (
                <div className="card overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="border-b border-brand-border bg-brand-black">
                                <tr>
                                    {['User', 'Email', 'Role', 'Orders', 'Joined'].map((h) => (
                                        <th key={h} className="px-4 py-3 text-[10px] font-semibold uppercase tracking-widest text-brand-muted whitespace-nowrap">
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-brand-border">
                                {filtered.map((u) => (
                                    <tr key={u.id} className="hover:bg-brand-black/30 transition-colors">
                                        <td className="px-4 py-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-brand-gray border border-brand-border flex items-center justify-center flex-shrink-0">
                                                    <span className="text-xs font-bold text-brand-accent">{u.name?.[0]?.toUpperCase()}</span>
                                                </div>
                                                <span className="text-sm font-semibold text-brand-white">{u.name}</span>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-brand-muted">{u.email}</td>
                                        <td className="px-4 py-3">
                                            <span className={`status-badge border ${u.role === 'ADMIN'
                                                    ? 'bg-brand-accent/10 text-brand-accent border-brand-accent/30'
                                                    : 'bg-brand-gray text-brand-muted border-brand-border'
                                                }`}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-sm text-brand-white font-bold">{u._count?.orders ?? 0}</td>
                                        <td className="px-4 py-3 text-xs text-brand-muted">
                                            {new Date(u.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}
