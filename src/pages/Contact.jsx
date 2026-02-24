import { useEffect, useState } from 'react'
import { FiInstagram, FiMail, FiMessageSquare } from 'react-icons/fi'

export default function Contact() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
    const [submitted, setSubmitted] = useState(false)

    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        // In production, connect to your backend contact endpoint
        setSubmitted(true)
    }

    return (
        <div className="min-h-screen bg-brand-black text-brand-white">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-brand-border">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <p className="text-brand-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">Get in Touch</p>
                    <h1 className="font-display text-6xl md:text-8xl uppercase text-brand-white leading-none">
                        Contact<br />
                        <span className="text-gradient">Us</span>
                    </h1>
                    <p className="mt-8 text-brand-muted text-lg max-w-xl leading-relaxed">
                        Questions, feedback, or collaboration ideas? We'd love to hear from you.
                        Reach out and we'll get back to you within 24–48 hours.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                    {/* Info */}
                    <div className="space-y-8">
                        <h2 className="font-display text-2xl uppercase text-brand-white">Reach Us</h2>
                        <div className="space-y-6">
                            <a
                                href="https://www.instagram.com/pulse_pr_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-4 group"
                            >
                                <div className="w-10 h-10 border border-brand-border flex items-center justify-center text-brand-muted group-hover:text-brand-accent group-hover:border-brand-accent transition-all duration-200">
                                    <FiInstagram size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-muted uppercase tracking-widest">Instagram</p>
                                    <p className="text-brand-white text-sm">@pulse_pr_</p>
                                </div>
                            </a>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 border border-brand-border flex items-center justify-center text-brand-muted">
                                    <FiMail size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-muted uppercase tracking-widest">Email</p>
                                    <p className="text-brand-white text-sm">support@pulsepr.in</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 border border-brand-border flex items-center justify-center text-brand-muted">
                                    <FiMessageSquare size={18} />
                                </div>
                                <div>
                                    <p className="text-xs text-brand-muted uppercase tracking-widest">Response Time</p>
                                    <p className="text-brand-white text-sm">24 – 48 Hours</p>
                                </div>
                            </div>
                        </div>

                        <div className="card p-6 mt-8">
                            <h3 className="text-brand-white text-xs font-semibold uppercase tracking-widest mb-3">Business Hours</h3>
                            <div className="space-y-2 text-sm text-brand-muted">
                                <div className="flex justify-between">
                                    <span>Monday – Friday</span>
                                    <span>10 AM – 6 PM IST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Saturday</span>
                                    <span>11 AM – 4 PM IST</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>Sunday</span>
                                    <span>Closed</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Form */}
                    <div className="lg:col-span-2">
                        {submitted ? (
                            <div className="card p-12 text-center border-glow">
                                <p className="text-brand-accent text-5xl mb-4">✓</p>
                                <h3 className="font-display text-3xl uppercase text-brand-white mb-3">Message Sent!</h3>
                                <p className="text-brand-muted">
                                    Thanks for reaching out. We'll get back to you within 24–48 hours.
                                </p>
                                <button
                                    className="btn-secondary mt-8"
                                    onClick={() => { setForm({ name: '', email: '', subject: '', message: '' }); setSubmitted(false) }}
                                >
                                    Send Another
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="card p-8 space-y-6">
                                <h2 className="font-display text-2xl uppercase text-brand-white mb-2">Send a Message</h2>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="label">Your Name</label>
                                        <input
                                            name="name"
                                            type="text"
                                            required
                                            value={form.name}
                                            onChange={handleChange}
                                            placeholder="John Doe"
                                            className="input-field"
                                        />
                                    </div>
                                    <div>
                                        <label className="label">Email Address</label>
                                        <input
                                            name="email"
                                            type="email"
                                            required
                                            value={form.email}
                                            onChange={handleChange}
                                            placeholder="john@example.com"
                                            className="input-field"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="label">Subject</label>
                                    <input
                                        name="subject"
                                        type="text"
                                        required
                                        value={form.subject}
                                        onChange={handleChange}
                                        placeholder="Order issue, product query..."
                                        className="input-field"
                                    />
                                </div>
                                <div>
                                    <label className="label">Message</label>
                                    <textarea
                                        name="message"
                                        required
                                        rows={6}
                                        value={form.message}
                                        onChange={handleChange}
                                        placeholder="Describe your query in detail..."
                                        className="input-field resize-none"
                                    />
                                </div>
                                <button type="submit" className="btn-primary w-full justify-center">
                                    Send Message
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
