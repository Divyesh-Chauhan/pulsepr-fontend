import { useEffect } from 'react'

export default function About() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="min-h-screen bg-brand-black text-brand-white">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-brand-border">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <p className="text-brand-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">Our Story</p>
                    <h1 className="font-display text-6xl md:text-8xl uppercase text-brand-white leading-none">
                        About<br />
                        <span className="text-gradient">PULSEPR</span>
                    </h1>
                    <p className="mt-8 text-brand-muted text-lg max-w-2xl leading-relaxed">
                        Born from the streets, defined by culture. PULSEPR is more than a brand —
                        it's a movement for those who live at the pulse of what's next.
                    </p>
                </div>
            </div>

            {/* Mission */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-brand-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">Mission</p>
                        <h2 className="font-display text-4xl md:text-5xl uppercase text-brand-white mb-6">
                            Crafted for the Bold
                        </h2>
                        <p className="text-brand-muted leading-relaxed mb-4">
                            PULSEPR was founded with a singular vision: to create premium streetwear that speaks
                            without words. Every stitch, every cut, every graphic is a deliberate choice — designed
                            to make you feel as powerful as you look.
                        </p>
                        <p className="text-brand-muted leading-relaxed">
                            We believe fashion is an extension of personality. Our collections are limited,
                            intentional, and built to last — because what you wear should reflect who you are,
                            not just what's trending.
                        </p>
                    </div>
                    <div className="card p-10 border-glow">
                        <div className="grid grid-cols-2 gap-8">
                            {[
                                { number: '2024', label: 'Founded' },
                                { number: '100%', label: 'Premium Cotton' },
                                { number: 'Limited', label: 'Drops Only' },
                                { number: '∞', label: 'Street Cred' },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center">
                                    <p className="font-display text-4xl text-brand-accent">{stat.number}</p>
                                    <p className="text-brand-muted text-xs uppercase tracking-widest mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Values */}
            <div className="border-t border-brand-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                    <p className="text-brand-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4 text-center">What We Stand For</p>
                    <h2 className="font-display text-4xl uppercase text-brand-white text-center mb-16">Our Values</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: 'Quality First',
                                desc: 'We refuse to compromise. Every piece is rigorously quality-checked before it reaches you. Premium materials, premium finish — always.',
                                icon: '◈',
                            },
                            {
                                title: 'Authenticity',
                                desc: "We don't follow trends — we set them. PULSEPR is built on originality, drawing from street culture, art, and music to create designs that are genuinely unique.",
                                icon: '◉',
                            },
                            {
                                title: 'Community',
                                desc: 'Our customers are our brand. From the streets to social media, the PULSEPR family is a global community of individuals who refuse to blend in.',
                                icon: '◎',
                            },
                        ].map((val) => (
                            <div key={val.title} className="card p-8 hover:border-brand-accent transition-colors duration-300">
                                <p className="text-brand-accent text-3xl mb-4">{val.icon}</p>
                                <h3 className="text-brand-white font-semibold uppercase tracking-widest text-sm mb-3">{val.title}</h3>
                                <p className="text-brand-muted text-sm leading-relaxed">{val.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="border-t border-brand-border">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 text-center">
                    <h2 className="font-display text-4xl uppercase text-brand-white mb-4">Join the Movement</h2>
                    <p className="text-brand-muted mb-8">Follow us on Instagram for exclusive drops and behind-the-scenes content.</p>
                    <a
                        href="https://www.instagram.com/pulse_pr_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="btn-primary"
                    >
                        @pulse_pr_ on Instagram
                    </a>
                </div>
            </div>
        </div>
    )
}
