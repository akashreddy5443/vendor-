export function ProductCardSkeleton() {
    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm h-[480px] animate-pulse">
            {/* Image Placeholder */}
            <div className="aspect-square bg-slate-100 relative">
                <div className="absolute top-4 left-4 w-16 h-6 bg-slate-200 rounded-full" />
            </div>

            {/* Content Placeholder */}
            <div className="p-6 flex flex-col flex-grow h-full">
                {/* Auth Hub & delivery */}
                <div className="flex justify-between items-center mb-4">
                    <div className="h-3 w-24 bg-slate-100 rounded" />
                    <div className="h-4 w-20 bg-slate-100 rounded-full" />
                </div>

                {/* Title */}
                <div className="h-6 w-3/4 bg-slate-200 rounded mb-2" />

                {/* Short benefit */}
                <div className="h-3 w-1/2 bg-slate-100 rounded mb-4" />

                {/* Description */}
                <div className="space-y-2 mb-6">
                    <div className="h-3 w-full bg-slate-100 rounded" />
                    <div className="h-3 w-5/6 bg-slate-100 rounded" />
                </div>

                {/* Price & Action */}
                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                    <div className="space-y-1">
                        <div className="h-3 w-12 bg-slate-100 rounded" />
                        <div className="h-8 w-24 bg-slate-200 rounded" />
                    </div>
                    <div className="h-11 w-11 bg-slate-100 rounded-2xl" />
                </div>
            </div>
        </div>
    )
}
