import { createClient } from '@/lib/supabase/server'
import { RatingStars } from '@/components/ui/RatingStars'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'
import { approveReview, deleteReview, rejectReview } from './actions'

export default async function AdminReviewsPage() {
    try {
        const { data: reviews, error } = await supabase
            .from('reviews')
            .select(`
                *,
                user:user_id(email)
            `)
            .order('created_at', { ascending: false })

        if (error) {
            return (
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100">
                    <h2 className="font-bold">Database Error</h2>
                    <p className="text-sm">{error.message}</p>
                </div>
            )
        }

        return (
            <div className="p-8 max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 font-serif">Customer Reviews</h1>
                        <p className="text-gray-500 text-sm mt-1">Moderate and manage product feedback.</p>
                    </div>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg border border-blue-100">
                        <span className="text-blue-700 font-bold text-sm">{reviews?.length || 0} Total Reviews</span>
                    </div>
                </div>

                <div className="grid gap-6">
                    {reviews?.map(r => (
                        <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-3">
                                            <span className="font-bold text-gray-900">{r.author_name}</span>
                                            <span className="text-gray-400 text-xs">•</span>
                                            <span className="text-gray-500 text-xs">{(r.user as any)?.email || 'Guest'}</span>
                                            {r.is_verified_purchase && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                    Verified Buyer
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <RatingStars rating={r.rating} size="sm" />
                                            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${r.status === 'approved' ? 'bg-green-50 text-green-600 border-green-100' :
                                                    r.status === 'rejected' ? 'bg-red-50 text-red-600 border-red-100' :
                                                        'bg-yellow-50 text-yellow-600 border-yellow-100'
                                                }`}>
                                                {r.status}
                                            </span>
                                        </div>

                                        <p className="text-gray-700 text-sm leading-relaxed max-w-2xl bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                                            "{r.comment}"
                                        </p>

                                        <p className="text-[10px] text-gray-400 font-medium">
                                            Submitted on {new Date(r.created_at).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="flex md:flex-col gap-2 shrink-0">
                                        {r.status !== 'approved' && (
                                            <form action={approveReview.bind(null, r.id)}>
                                                <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-colors">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                                                </button>
                                            </form>
                                        )}
                                        {r.status !== 'rejected' && (
                                            <form action={rejectReview.bind(null, r.id)}>
                                                <button className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">
                                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                                </button>
                                            </form>
                                        )}
                                        <form action={deleteReview.bind(null, r.id)}>
                                            <button className="w-full flex items-center justify-center gap-2 text-gray-400 px-4 py-2 rounded-xl text-xs font-bold hover:text-red-500 hover:bg-red-50 transition-all">
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                    {!reviews?.length && (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">No reviews found in the database.</p>
                        </div>
                    )}
                </div>
            </div>
        )
    } catch (e: any) {
        return (
            <div className="p-4 bg-red-50 text-red-600">
                Exception: {e.message}
            </div>
        )
    }
}
