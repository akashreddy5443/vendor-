import { createClient } from '@/lib/supabase/server'
import { RatingStars } from '@/components/ui/RatingStars'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'
import { approveReview, deleteReview, rejectReview } from './actions'

export default async function AdminReviewsPage() {
    try {
        const supabase = await createClient()

        // 1. Fetch Reviews first
        const { data: reviews, error: reviewsError } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false })

        if (reviewsError) throw reviewsError

        // 2. Fetch User Details (Email & Avatar) for these reviews manually
        const userIds = Array.from(new Set(reviews?.map(r => r.user_id).filter(Boolean)))

        let usersMap: Record<string, { email: string, avatar_url: string | null }> = {}
        if (userIds.length > 0) {
            const { data: usersData } = await supabase
                .from('users')
                .select('id, email, avatar_url')
                .in('id', userIds)

            if (usersData) {
                usersData.forEach(u => {
                    usersMap[u.id] = {
                        email: u.email,
                        avatar_url: u.avatar_url
                    }
                });
            }
        }

        // Combine data
        const enrichedReviews = reviews?.map(r => ({
            ...r,
            user: usersMap[r.user_id] || { email: 'Guest', avatar_url: null }
        }))

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
                    {enrichedReviews?.map((r: any) => (
                        <div key={r.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                            <div className="p-6">
                                <div className="flex flex-col md:flex-row justify-between gap-6">
                                    {/* Left: Avatar & Content */}
                                    <div className="flex gap-4 flex-1">
                                        <div className="shrink-0 pt-1">
                                            {r.user?.avatar_url ? (
                                                <img
                                                    src={r.user.avatar_url}
                                                    alt={r.author_name}
                                                    className="w-12 h-12 rounded-full object-cover ring-2 ring-gray-100 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-lg border-2 border-white shadow-sm">
                                                    {r.author_name?.[0].toUpperCase() || 'U'}
                                                </div>
                                            )}
                                        </div>
                                        <div className="space-y-4 flex-1">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <span className="font-bold text-gray-900">{r.author_name}</span>
                                                <span className="text-gray-400 text-xs">•</span>
                                                <span className="text-gray-500 text-xs">{r.user?.email || 'Guest Account'}</span>
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

                                            <p className="text-gray-700 text-sm leading-relaxed bg-gray-50 p-4 rounded-xl border border-gray-100 italic">
                                                "{r.comment}"
                                            </p>

                                            <p className="text-[10px] text-gray-400 font-medium">
                                                Submitted on {new Date(r.created_at).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex md:flex-col gap-2 shrink-0 md:w-32">
                                        {r.status !== 'approved' && (
                                            <form action={async () => {
                                                'use server'
                                                await approveReview(r.id)
                                            }}>
                                                <button className="w-full flex items-center justify-center gap-2 bg-green-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-green-700 transition-colors">
                                                    <CheckCircle className="w-3.5 h-3.5" /> Approve
                                                </button>
                                            </form>
                                        )}
                                        {r.status !== 'rejected' && (
                                            <form action={async () => {
                                                'use server'
                                                await rejectReview(r.id)
                                            }}>
                                                <button className="w-full flex items-center justify-center gap-2 border border-red-200 text-red-600 px-4 py-2 rounded-xl text-xs font-bold hover:bg-red-50 transition-colors">
                                                    <XCircle className="w-3.5 h-3.5" /> Reject
                                                </button>
                                            </form>
                                        )}
                                        <form action={async () => {
                                            'use server'
                                            await deleteReview(r.id)
                                        }}>
                                            <button className="w-full flex items-center justify-center gap-2 text-gray-400 px-4 py-2 rounded-xl text-xs font-bold hover:text-red-500 hover:bg-red-50 transition-all">
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </form>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {(!enrichedReviews || enrichedReviews.length === 0) && (
                        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 font-medium">No reviews found in the database.</p>
                        </div>
                    )}
                </div>
            </div>
        )
    } catch (e: any) {
        return (
            <div className="p-8 max-w-4xl mx-auto">
                <div className="p-4 bg-red-50 text-red-600 rounded-xl border border-red-100 shadow-sm">
                    <h2 className="font-bold flex items-center gap-2 mb-1">
                        <XCircle className="w-5 h-5" /> Database Connection Issue
                    </h2>
                    <p className="text-sm opacity-90">{e.message}</p>
                </div>
            </div>
        )
    }
}
