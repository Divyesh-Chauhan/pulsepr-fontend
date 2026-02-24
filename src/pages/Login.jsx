import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { HiArrowRight, HiEye, HiEyeOff } from 'react-icons/hi'

export default function Login() {
    const { login, isAuthenticated, isAdmin } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [showPwd, setShowPwd] = useState(false)

    if (isAuthenticated) {
        navigate(isAdmin ? '/admin' : '/', { replace: true })
        return null
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) { toast.error('Please fill all fields'); return }
        setLoading(true)
        try {
            const user = await login(form.email, form.password)
            toast.success(`Welcome back, ${user.name}!`)
            navigate(user.role === 'ADMIN' ? '/admin' : '/')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center bg-brand-black px-4">
            <div className="w-full max-w-md animate-slide-up">
                {/* Header */}
                <div className="text-center mb-10">
                    <Link to="/" className="font-display text-3xl tracking-widest text-brand-white">PULSEPR</Link>
                    <h1 className="text-brand-muted text-xs font-semibold uppercase tracking-widest mt-3">Welcome Back</h1>
                </div>

                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="john@example.com"
                                className="input-field"
                                autoFocus
                            />
                        </div>

                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="••••••••"
                                    className="input-field pr-12"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPwd(!showPwd)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-white transition-colors"
                                >
                                    {showPwd ? <HiEyeOff size={18} /> : <HiEye size={18} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center py-4 mt-2 disabled:opacity-60"
                        >
                            {loading ? (
                                <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <HiArrowRight size={16} />
                            )}
                            {loading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    <p className="text-center text-brand-muted text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-brand-accent hover:text-brand-white transition-colors font-semibold">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
