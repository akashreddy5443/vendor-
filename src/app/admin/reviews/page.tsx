import { createClient } from '@/lib/supabase/server'
import { RatingStars } from '@/components/ui/RatingStars'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'
import { approveReview, deleteReview, rejectReview } from './actions'

export default async function AdminReviewsPage() {
    try {
        const supabase = await createClient()

        const { data: reviews, error } = await supabase
            .from('reviews')
            .select(`
                *,
                products ( title )
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Reviews Fetch Error:', error)
            return (
                <div className="p-10 rounded-xl bg-red-50 border border-red-200">
                    <h2 className="text-red-800 font-bold">Database Error</h2>
                    <p className="text-red-600 text-sm mt-1">{error.message}</p>
                    <p className="text-red-500 text-xs mt-2 italic">Hint: Ensure you have run the reviews migration in Supabase SQL editor.</p>
                </div>
            )
        }

        return (
            <div className="space-y-6">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Customer Feedback</h2>
                    <p className="text-gray-500">Manage and moderate product reviews.</p>
                </div>

                <div className="rounded-xl border border-gray-200 bg-white overflow-hidden shadow-sm">
                    <table className="w-full text-left text-sm text-gray-500">
                        <thead className="border-b border-gray-200 text-xs uppercase text-gray-500 bg-gray-50">
                            <tr>
                                <th className="px-6 py-3">User / Date</th>
                                <th className="px-6 py-3">Product</th>
                                <th className="px-6 py-3">Rating & Comment</th>
                                <th className="px-6 py-3">Status</th>
                                <th className="px-6 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {reviews?.map((review) => (
                                <tr key={review.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="font-medium text-gray-900">{review.author_name}</div>
                                        <div className="text-gray-500 text-xs">{new Date(review.created_at).toLocaleDateString()}</div>
                                    </td>
                                    <td className="px-6 py-4 text-gray-900">
                                        {(review.products as any)?.title || 'Unknown Product'}
                                    </td>
                                    <td className="px-6 py-4 max-w-md">
                                        <RatingStars rating={review.rating} size="sm" />
                                        <p className="mt-1 text-gray-600 line-clamp-2">{review.comment}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span
                                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${review.status === 'approved'
                                                ? 'bg-green-100 text-green-800'
                                                : review.status === 'rejected'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-yellow-100 text-yellow-800'
                                                }`}
                                        >
                                            {review.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            {review.status !== 'approved' && (
                                                <form action={async () => { await approveReview(review.id) }}>
                                                    <button
                                                        className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                        title="Approve"
                                                    >
                                                        <CheckCircle className="w-5 h-5" />
                                                    </button>
                                                </form>
                                            )}
                                            {review.status !== 'rejected' && (
                                                <form action={async () => { await rejectReview(review.id) }}>
                                                    <button
                                                        className="p-1.5 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                                                        title="Reject"
                                                    >
                                                        <XCircle className="w-5 h-5" />
                                                    </button>
                                                </form>
                                            )}
                                            <form action={async () => { await deleteReview(review.id) }}>
                                                <button
                                                    className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </form>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {(!reviews || reviews.length === 0) && (
                                <tr>
                                    <td colSpan={5} className="px-6 py-12 text-center text-gray-500">
                                        No reviews yet.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    } catch (e: any) {
        return (
            <div className="p-10 rounded-xl bg-red-50 border border-red-200">
                <h2 className="text-red-800 font-bold">Application Error</h2>
                <p className="text-red-600 text-sm mt-1">{e.message}</p>
                <p className="text-red-500 text-xs mt-2 italic text-wrap break-all">Digest: {e.digest || 'No digest'}</p>
            </div>
        )
    }
}
