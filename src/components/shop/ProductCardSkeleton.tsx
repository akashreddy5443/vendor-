export function ProductCardSkeleton() {
    return (
        <div className="w-full h-[420px] md:h-[500px] bg-transparent animate-pulse flex flex-col">
            {/* Image Container */}
            <div className="relative w-full h-[320px] md:h-[380px] rounded-[2rem] bg-slate-100 overflow-hidden">
                <div className="absolute top-4 left-4 w-12 h-6 bg-slate-200 rounded-full" />
            </div>

            {/* Content Lines */}
            <div className="mt-4 px-2 space-y-2">
                <div className="flex justify-between items-start">
                    <div className="space-y-2 flex-1">
                        <div className="h-3 w-20 bg-slate-100 rounded-lg" />
                        <div className="h-5 w-3/4 bg-slate-200 rounded-lg" />
                    </div>
                    <div className="h-6 w-16 bg-slate-200 rounded-lg" />
                </div>
            </div>
        </div>
    )
}
