export default function Loader({ fullScreen = false, size = 'md' }) {
    const sizeClass = size === 'lg' ? 'w-12 h-12' : size === 'sm' ? 'w-5 h-5' : 'w-8 h-8'

    const spinner = (
        <div className={`${sizeClass} border-2 border-brand-border border-t-brand-accent rounded-full animate-spin`} />
    )

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-brand-black flex items-center justify-center z-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-2 border-brand-border border-t-brand-accent rounded-full animate-spin" />
                    <span className="text-brand-muted text-xs uppercase tracking-widest">Loading...</span>
                </div>
            </div>
        )
    }

    return spinner
}
