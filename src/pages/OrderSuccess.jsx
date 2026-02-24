import { Link } from 'react-router-dom'
import { HiCheckCircle, HiArrowRight } from 'react-icons/hi'

export default function OrderSuccess() {
    return (
        <div className="min-h-screen pt-20 flex items-center justify-center page-enter">
            <div className="text-center px-4 animate-slide-up">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-brand-accent/10 border-2 border-brand-accent mb-8">
                    <HiCheckCircle size={48} className="text-brand-accent" />
                </div>
                <h1 className="font-display text-6xl uppercase text-brand-white mb-4">Order Placed!</h1>
                <p className="text-brand-muted text-sm max-w-sm mx-auto leading-relaxed mb-10">
                    Your payment was successful and your order has been placed. You'll receive updates shortly.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link to="/orders" className="btn-primary">
                        Track Orders <HiArrowRight size={16} />
                    </Link>
                    <Link to="/products" className="btn-secondary">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        </div>
    )
}
