import { Link } from 'react-router-dom'
import { FiInstagram, FiTwitter, FiYoutube } from 'react-icons/fi'

const socialLinks = [
    {
        Icon: FiInstagram,
        href: 'https://www.instagram.com/pulse_pr_?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==',
        label: 'Instagram',
    },
    { Icon: FiTwitter, href: '#', label: 'Twitter' },
    { Icon: FiYoutube, href: '#', label: 'YouTube' },
]

const infoLinks = [
    { label: 'About Us', to: '/about' },
    { label: 'Shipping Policy', to: '/shipping-policy' },
    { label: 'Return Policy', to: '/return-policy' },
    { label: 'Contact', to: '/contact' },
]

export default function Footer() {
    return (
        <footer className="bg-brand-gray border-t border-brand-border mt-auto">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <span className="font-display text-4xl tracking-widest text-brand-white">PULSEPR</span>
                        <p className="mt-4 text-brand-muted text-sm leading-relaxed max-w-xs">
                            Premium streetwear crafted for those who set the pulse. Every thread tells a story.
                        </p>
                        <div className="flex gap-4 mt-6">
                            {socialLinks.map(({ Icon, href, label }) => (
                                <a
                                    key={label}
                                    href={href}
                                    target={href !== '#' ? '_blank' : undefined}
                                    rel={href !== '#' ? 'noopener noreferrer' : undefined}
                                    aria-label={label}
                                    className="w-9 h-9 border border-brand-border flex items-center justify-center text-brand-muted hover:text-brand-accent hover:border-brand-accent transition-all duration-200"
                                >
                                    <Icon size={16} />
                                </a>
                            ))}
                        </div>
                    </div>

                    {/* Shop */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-4">Shop</h4>
                        <ul className="space-y-3">
                            {['Oversized Tees', 'Regular Fit', 'Graphic Tees', 'Hoodies'].map((item) => (
                                <li key={item}>
                                    <Link
                                        to="/products"
                                        className="text-sm text-brand-muted hover:text-brand-white transition-colors"
                                    >
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Info */}
                    <div>
                        <h4 className="text-xs font-semibold uppercase tracking-widest text-brand-white mb-4">Info</h4>
                        <ul className="space-y-3">
                            {infoLinks.map(({ label, to }) => (
                                <li key={label}>
                                    <Link
                                        to={to}
                                        className="text-sm text-brand-muted hover:text-brand-white transition-colors"
                                    >
                                        {label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="mt-16 pt-8 border-t border-brand-border flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-brand-muted text-xs">
                        © {new Date().getFullYear()} PULSEPR. All rights reserved.
                    </p>
                    <div className="flex items-center gap-2">
                        <span className="text-brand-muted text-xs">Secure payments by</span>
                        <span className="text-brand-accent text-xs font-bold tracking-widest">RAZORPAY</span>
                    </div>
                </div>
            </div>
        </footer>
    )
}
