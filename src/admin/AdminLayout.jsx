import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import AdminSidebar from './AdminSidebar'
import { useState } from 'react'
import { HiMenu, HiX } from 'react-icons/hi'

export default function AdminLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(false)

    return (
        <div className="min-h-screen bg-brand-black flex">
            {/* Mobile overlay */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-40 transition-transform duration-300 md:relative md:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                }`}>
                <AdminSidebar onClose={() => setSidebarOpen(false)} />
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col min-w-0">
                {/* Mobile topbar */}
                <div className="md:hidden flex items-center gap-4 px-4 py-4 bg-brand-gray border-b border-brand-border">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="text-brand-muted hover:text-brand-white transition-colors"
                    >
                        <HiMenu size={24} />
                    </button>
                    <span className="font-display text-xl tracking-widest text-brand-white">PULSEPR Admin</span>
                </div>

                {/* Page area */}
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}
