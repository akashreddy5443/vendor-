import { createClient } from '@/lib/supabase/server'
import { StarRating } from './StarRating'
import { User } from 'lucide-react'

export async function ReviewsList({ productId }: { productId: string }) {
    const supabase = await createClient()

    // Join with profiles if available, or just show abstract user
    // For now assuming we might not have public profiles set up fully, so just showing anonymous or email checks if safe.
    // Actually, let's just show initials or "Verified User"
    const { data: reviews } = await supabase
        .from('reviews')
        .select('*')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })

    if (!reviews || reviews.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-zinc-800 rounded-xl text-gray-500">
                No reviews yet. Be the first to review!
            </div>
        )
    }

    return (
        <div className="space-y-6">
            {reviews.map((review) => (
                <div key={review.id} className="border-b border-zinc-800 pb-6 last:border-0">
                    <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                            <div className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400">
                                <User className="h-4 w-4" />
                            </div>
                            <span className="font-medium text-white text-sm">Reviewer</span>
                        </div>
                        <span className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</span>
                    </div>
                    <div className="mb-2">
                        <StarRating rating={review.rating} size={14} />
                    </div>
                    <p className="text-gray-300 text-sm leading-relaxed">{review.comment}</p>
                </div>
            ))}
        </div>
    )
}
