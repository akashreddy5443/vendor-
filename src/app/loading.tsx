export default function Loading() {
    return (
        <div className="flex h-screen w-full items-center justify-center bg-slate-950">
            <div className="flex flex-col items-center gap-4">
                <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-800 border-t-primary" />
                <p className="animate-pulse font-heading text-sm font-black uppercase tracking-[0.3em] text-slate-500">
                    Loading Protocols...
                </p>
            </div>
        </div>
    )
}
