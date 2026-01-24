export default function Loading() {
    return (
        <div className="bg-black text-white min-h-screen">
            <div className="mx-auto max-w-7xl px-6 lg:px-8 py-16">
                <div className="mb-12">
                    <div className="h-10 w-48 bg-gray-900 rounded animate-pulse mb-4"></div>
                    <div className="h-6 w-96 bg-gray-900 rounded animate-pulse"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="rounded-xl border border-gray-800 bg-gray-900 overflow-hidden">
                            <div className="aspect-square bg-gray-800 animate-pulse"></div>
                            <div className="p-4 space-y-3">
                                <div className="h-6 w-3/4 bg-gray-800 rounded animate-pulse"></div>
                                <div className="flex justify-between">
                                    <div className="h-4 w-1/4 bg-gray-800 rounded animate-pulse"></div>
                                    <div className="h-4 w-1/4 bg-gray-800 rounded animate-pulse"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
