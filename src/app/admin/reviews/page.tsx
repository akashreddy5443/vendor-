import { createClient } from '@/lib/supabase/server'
import { RatingStars } from '@/components/ui/RatingStars'
import { Trash2, CheckCircle, XCircle } from 'lucide-react'
import { approveReview, deleteReview, rejectReview } from './actions'

export default async function AdminReviewsPage() {
    try {
        const supabase = await createClient()
        const { data: reviews, error } = await supabase
            .from('reviews')
            .select('*')
            .order('created_at', { ascending: false })

        if (error) {
            return (
                <div className="p-4 bg-red-50 text-red-600">
                    Fetch Error: {error.message}
                </div>
            )
        }

        return (
            <div className="p-8">
                <h1 className="text-2xl font-bold mb-4">Reviews Debug List</h1>
                <div className="space-y-4">
                    {reviews?.map(r => (
                        <div key={r.id} className="p-4 border rounded bg-white text-black">
                            <p><strong>Author:</strong> {r.author_name}</p>
                            <p><strong>Rating:</strong> {r.rating}</p>
                            <p><strong>Comment:</strong> {r.comment}</p>
                            <p><strong>Status:</strong> {r.status}</p>
                        </div>
                    ))}
                    {!reviews?.length && <p>No reviews found.</p>}
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
