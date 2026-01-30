'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RatingStars } from '@/components/ui/RatingStars'
import { InputRating } from '@/components/ui/InputRating'
import { toast } from 'sonner'
import { User } from 'lucide-react'

export function ProductReviews({ productId, initialReviews }: { productId: string, initialReviews: any[] }) {
    const [reviews, setReviews] = useState(initialReviews)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [name, setName] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            toast.error('Please select a rating')
            return
        }
        setIsSubmitting(true)

        const formData = new FormData()
        formData.append('productId', productId)
        formData.append('rating', rating.toString())
        formData.append('comment', comment)
        formData.append('authorName', name)

        const { submitReview } = await import('@/app/(user)/products/actions')
        const result = await submitReview(formData)

        if (result.error) {
            toast.error(result.error)
        } else {
            toast.success('Review submitted! It will appear after moderation.')
            setRating(0)
            setComment('')
            setName('')
            // Since it's now 'pending' by default, we don't necessarily update the local list 
            // unless we want to show a "thank you" state.
        }
        setIsSubmitting(false)
    }

    return (
        <div className="mt-16 border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Customer Reviews</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Review List */}
                <div className="space-y-8">
                    {reviews.length === 0 ? (
                        <div className="text-gray-500 italic">No reviews yet. Be the first to review!</div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                <div className="flex items-center gap-2 mb-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                                        <User className="w-4 h-4" />
                                    </div>
                                    <span className="font-semibold text-gray-900">{review.author_name}</span>
                                    <span className="text-xs text-gray-400">• {new Date(review.created_at).toLocaleDateString()}</span>
                                </div>
                                <RatingStars rating={review.rating} size="sm" />
                                <p className="text-gray-600 mt-2 text-sm leading-relaxed">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Submit Form */}
                <div className="bg-gray-50 p-6 rounded-xl border border-gray-100 h-fit">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">Write a Review</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating</label>
                            <InputRating value={rating} onChange={setRating} />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Your Name</label>
                            <input
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="John Doe"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Review</label>
                            <textarea
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                rows={4}
                                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                placeholder="Share your thoughts..."
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-blue-600 text-white font-bold py-2.5 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    )
}
