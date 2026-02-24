import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const sections = [
    {
        title: 'Processing Time',
        content: [
            'Orders are processed within 1–2 business days after payment confirmation.',
            'Orders placed on weekends or public holidays will be processed the next business day.',
            'You will receive an email with your order confirmation and tracking details once dispatched.',
            'During sale periods or special launches, processing may take up to 3–4 business days.',
        ],
    },
    {
        title: 'Shipping Partners & Delivery Time',
        content: [
            'We partner with trusted courier services including Delhivery, Blue Dart, and DTDC.',
            'Standard delivery within India: 4–7 business days from dispatch.',
            'Express delivery (where available): 2–3 business days from dispatch.',
            'Delivery timelines may vary for remote areas or during peak seasons.',
        ],
    },
    {
        title: 'Shipping Charges',
        content: [
            'Free shipping on all orders above ₹999.',
            'A flat shipping fee of ₹79 applies to orders below ₹999.',
            'Express shipping charges (if selected) will be displayed at checkout.',
            'Shipping charges are non-refundable unless the return is due to an error on our part.',
        ],
    },
    {
        title: 'Tracking Your Order',
        content: [
            'Once your order is dispatched, a tracking number will be sent to your registered email.',
            'You can also track your order from the "My Orders" section in your account.',
            'Allow up to 12 hours for the tracking link to become active after dispatch.',
            'If you face issues with tracking, contact our support team with your order ID.',
        ],
    },
    {
        title: 'Failed Delivery Attempts',
        content: [
            'Our courier partners will make up to 3 delivery attempts.',
            'If all attempts fail, the package will be returned to our warehouse.',
            'In such cases, re-shipping charges will apply for a second dispatch.',
            'Please ensure the delivery address and contact number provided are accurate.',
        ],
    },
    {
        title: 'Damaged or Lost Packages',
        content: [
            'If your package arrives damaged, please refuse to accept it and notify us immediately.',
            'If a package is marked as delivered but not received, contact us within 48 hours.',
            'We will investigate the matter with our courier partner and take appropriate action.',
            'In confirmed cases of loss, we will reship or issue a full refund.',
        ],
    },
]

export default function ShippingPolicy() {
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
                        Shipping<br />
                        <span className="text-gradient">Policy</span>
                    </h1>
                    <p className="mt-8 text-brand-muted text-lg max-w-2xl leading-relaxed">
                        Everything you need to know about how we get your order safely and swiftly to your door.
                    </p>
                    <p className="mt-4 text-brand-muted text-xs uppercase tracking-widest">
                        Last updated: February 2025
                    </p>
                </div>
            </div>

            {/* Highlights bar */}
            <div className="border-b border-brand-border bg-brand-gray">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        {[
                            { label: 'Free Shipping', value: 'Orders ₹999+' },
                            { label: 'Processing', value: '1–2 Business Days' },
                            { label: 'Delivery', value: '4–7 Business Days' },
                            { label: 'Tracking', value: 'Real-Time Updates' },
                        ].map((item) => (
                            <div key={item.label}>
                                <p className="text-brand-accent text-xs font-semibold uppercase tracking-widest">{item.label}</p>
                                <p className="text-brand-white text-sm mt-1">{item.value}</p>
                            </div>
                        ))}
                    </div>
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
                    <h3 className="font-display text-2xl uppercase text-brand-white mb-3">Have a Shipping Query?</h3>
                    <p className="text-brand-muted text-sm mb-6">
                        Our support team is ready to help with any shipping-related questions.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link to="/contact" className="btn-primary">Contact Support</Link>
                        <Link to="/orders" className="btn-secondary">Track My Order</Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
