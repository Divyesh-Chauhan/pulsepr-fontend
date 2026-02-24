import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const sections = [
    {
        title: 'Eligibility for Returns',
        content: [
            'Items must be returned within 7 days of delivery.',
            'Products must be unworn, unwashed, and in their original condition with all tags attached.',
            'Sale items, accessories, and customised products are not eligible for returns.',
            'Items showing signs of wear, washing, staining, or damage caused after delivery will not be accepted.',
        ],
    },
    {
        title: 'How to Initiate a Return',
        content: [
            'DM us on Instagram @pulse_pr_ or email us at support@pulsepr.in with your order ID and reason for return.',
            'Our team will verify your request within 24 hours and share the return shipping address.',
            'Pack the item securely in its original packaging to prevent damage during transit.',
            'Share the courier tracking details with us once shipped.',
        ],
    },
    {
        title: 'Refund Process',
        content: [
            'Once we receive and inspect the returned item, we will process your refund within 5–7 business days.',
            'Refunds are issued to the original payment method used during purchase.',
            'Shipping charges (if any) are non-refundable unless the return is due to a defective or incorrect product.',
            'You will receive an email confirmation once the refund has been processed.',
        ],
    },
    {
        title: 'Exchanges',
        content: [
            'We currently offer size exchanges subject to availability.',
            'To exchange, initiate a return as described above and place a new order for the desired size.',
            'We recommend checking our size guide before placing an order to avoid sizing issues.',
        ],
    },
    {
        title: 'Defective or Wrong Products',
        content: [
            'If you receive a defective, damaged, or incorrect product, please contact us within 48 hours of delivery.',
            'Share clear photographs of the issue along with your order ID.',
            'In such cases, we will arrange a pickup at no additional cost and offer a full refund or replacement.',
        ],
    },
]

export default function ReturnPolicy() {
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

    return (
        <div className="min-h-screen bg-brand-black text-brand-white">
            {/* Hero */}
            <div className="relative overflow-hidden border-b border-brand-border">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/5 via-transparent to-transparent pointer-events-none" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
                    <p className="text-brand-accent text-xs font-semibold uppercase tracking-[0.3em] mb-4">Policies</p>
                    <h1 className="font-display text-6xl md:text-8xl uppercase text-brand-white leading-none">
                        Return &amp;<br />
                        <span className="text-gradient">Refund Policy</span>
                    </h1>
                    <p className="mt-8 text-brand-muted text-lg max-w-2xl leading-relaxed">
                        We want you to love every PULSEPR piece. If something isn't right, here's how we'll make it right.
                    </p>
                    <p className="mt-4 text-brand-muted text-xs uppercase tracking-widest">
                        Last updated: February 2025
                    </p>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-24 space-y-12">
                {sections.map((section) => (
                    <div key={section.title} className="card p-8 hover:border-brand-accent/40 transition-colors duration-300">
                        <h2 className="text-brand-white font-semibold uppercase tracking-widest text-sm mb-5 flex items-center gap-3">
                            <span className="w-4 h-px bg-brand-accent inline-block" />
                            {section.title}
                        </h2>
                        <ul className="space-y-3">
                            {section.content.map((point, i) => (
                                <li key={i} className="flex gap-3 text-brand-muted text-sm leading-relaxed">
                                    <span className="text-brand-accent mt-0.5 shrink-0">›</span>
                                    {point}
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}

                {/* Contact CTA */}
                <div className="card p-8 text-center border-glow">
                    <h3 className="font-display text-2xl uppercase text-brand-white mb-3">Need Help?</h3>
                    <p className="text-brand-muted text-sm mb-6">
                        Our support team is happy to assist with any return or refund queries.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/contact" className="btn-primary">Contact Support</Link>
                        <a
                            href="https://www.instagram.com/pulse_pr_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=="
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn-secondary"
                        >
                            DM on Instagram
                        </a>
                    </div>
                </div>
            </div>
        </div>
    )
}
