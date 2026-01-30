'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { RatingStars } from '@/components/ui/RatingStars'
import { InputRating } from '@/components/ui/InputRating'
import { toast } from 'sonner'
import { User } from 'lucide-react'
import Link from 'next/link'

export function ProductReviews({ productId, initialReviews, hasPurchased, isLoggedIn }: {
    productId: string,
    initialReviews: any[],
    hasPurchased: boolean,
    isLoggedIn: boolean
}) {
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
        }
        setIsSubmitting(false)
    }

    return (
        <div className="mt-16 border-t border-gray-200 pt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 font-serif">Customer Feedback</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Review List */}
                <div className="space-y-8">
                    {reviews.length === 0 ? (
                        <div className="text-gray-500 italic py-8 bg-gray-50 rounded-xl px-6 border border-dashed border-gray-200">
                            No reviews yet for this product.
                        </div>
                    ) : (
                        reviews.map((review) => (
                            <div key={review.id} className="border-b border-gray-100 pb-6 last:border-0">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 border border-blue-100">
                                        <User className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold text-gray-900">{review.author_name}</span>
                                            {review.is_verified_purchase && (
                                                <span className="text-[10px] font-bold uppercase tracking-wider bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                                    Verified Buyer
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-xs text-gray-400">{new Date(review.created_at).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>
                                <RatingStars rating={review.rating} size="sm" />
                                <p className="text-gray-600 mt-3 text-sm leading-relaxed whitespace-pre-wrap">{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>

                {/* Submit Form */}
                <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm h-fit sticky top-24">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 font-serif">Rate this product</h3>

                    {!isLoggedIn ? (
                        <div className="space-y-4 py-4">
                            <p className="text-gray-600 text-sm">Please sign in to share your experience with this product.</p>
                            <Link
                                href="/login"
                                className="inline-block w-full text-center bg-gray-900 text-white font-bold py-3 rounded-xl hover:bg-gray-800 transition-colors"
                            >
                                Sign In to Review
                            </Link>
                        </div>
                    ) : !hasPurchased ? (
                        <div className="bg-orange-50 border border-orange-100 p-4 rounded-xl">
                            <p className="text-orange-800 text-sm font-medium">
                                Only verified purchasers of this item can leave a review.
                            </p>
                            <p className="text-orange-600 text-xs mt-1">
                                We prioritize authentic feedback from customers who have actually used the product.
                            </p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Overall Rating</label>
                                <InputRating value={rating} onChange={setRating} />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Display Name</label>
                                <input
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                                    placeholder="your public name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-gray-500 mb-2">Your Experience</label>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    rows={4}
                                    className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-all"
                                    placeholder="What did you like or dislike?"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full bg-blue-600 text-white font-bold py-3.5 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-all shadow-lg shadow-blue-200"
                            >
                                {isSubmitting ? 'Submitting...' : 'Post Review'}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    )
}
