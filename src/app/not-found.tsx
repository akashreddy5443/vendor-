import Link from 'next/link'
import { ArrowLeft, AlertCircle } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="flex min-h-[80vh] flex-col items-center justify-center bg-slate-950 px-6 text-center">
            <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-slate-900/50 shadow-2xl shadow-black/50 ring-1 ring-white/10">
                <AlertCircle className="h-10 w-10 text-red-500" />
            </div>

            <h1 className="mb-4 font-heading text-6xl font-black tracking-tighter text-white md:text-8xl">
                404
            </h1>

            <h2 className="mb-8 font-heading text-xl font-bold uppercase tracking-widest text-slate-500">
                Signal Lost
            </h2>

            <p className="mb-10 max-w-md text-sm leading-relaxed text-slate-400">
                The page you are looking for has been removed, renamed, or is temporarily unavailable in this sector.
            </p>

            <Link
                href="/"
                className="group flex items-center gap-3 rounded-full bg-white px-8 py-4 text-xs font-black uppercase tracking-widest text-black transition-all hover:bg-slate-200 hover:px-10"
            >
                <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
                Return to Base
            </Link>
        </div>
    )
}
