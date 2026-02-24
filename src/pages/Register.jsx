import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { HiArrowRight, HiEye, HiEyeOff } from 'react-icons/hi'

export default function Register() {
    const { register, login } = useAuth()
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [loading, setLoading] = useState(false)
    const [showPwd, setShowPwd] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.name || !form.email || !form.password) { toast.error('Please fill all fields'); return }
        if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
        if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return }
        setLoading(true)
        try {
            await register(form.name, form.email, form.password)
            toast.success('Account created! Logging you in...')
            const user = await login(form.email, form.password)
            navigate(user.role === 'ADMIN' ? '/admin' : '/')
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen pt-16 flex items-center justify-center bg-brand-black px-4">
            <div className="w-full max-w-md animate-slide-up">
                <div className="text-center mb-10">
                    <Link to="/" className="font-display text-3xl tracking-widest text-brand-white">PULSEPR</Link>
                    <h1 className="text-brand-muted text-xs font-semibold uppercase tracking-widest mt-3">Create Account</h1>
                </div>

                <div className="card p-8">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="label">Full Name</label>
                            <input
                                type="text"
                                value={form.name}
                                onChange={(e) => setForm({ ...form, name: e.target.value })}
                                placeholder="John Doe"
                                className="input-field"
                                autoFocus
                            />
                        </div>
                        <div>
                            <label className="label">Email</label>
                            <input
                                type="email"
                                value={form.email}
                                onChange={(e) => setForm({ ...form, email: e.target.value })}
                                placeholder="john@example.com"
                                className="input-field"
                            />
                        </div>
                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <input
                                    type={showPwd ? 'text' : 'password'}
                                    value={form.password}
                                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                                    placeholder="Min. 6 characters"
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
                        <div>
                            <label className="label">Confirm Password</label>
                            <input
                                type={showPwd ? 'text' : 'password'}
                                value={form.confirm}
                                onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                                placeholder="Repeat password"
                                className="input-field"
                            />
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
                            {loading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <p className="text-center text-brand-muted text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-brand-accent hover:text-brand-white transition-colors font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
