'use client'

import { useState } from 'react'
import { submitReview } from '@/app/actions/reviews'
import { StarRating } from './StarRating'
import { Loader2 } from 'lucide-react'

export function ReviewForm({ productId }: { productId: string }) {
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (rating === 0) {
            setMessage('Please select a rating')
            return
        }
        setLoading(true)
        setMessage('')

        const formData = new FormData()
        formData.append('productId', productId)
        formData.append('rating', rating.toString())
        formData.append('comment', comment)

        const res = await submitReview(formData)
        setLoading(false)

        if (res.error) {
            setMessage(res.error)
        } else {
            setMessage(res.message || 'Thanks for your review!')
            setComment('')
            // Optional: reset rating or keep it
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 space-y-4">
            <h3 className="text-lg font-bold text-white">Write a Review</h3>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Rating</label>
                <div className="flex items-center gap-2">
                    <StarRating rating={rating} editable onRatingChange={setRating} size={24} />
                    <span className="text-sm text-gray-500 ml-2">{rating > 0 ? `${rating} Stars` : 'Select stars'}</span>
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-gray-400">Review</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Tell us what you liked or didn't like..."
                    className="w-full h-24 rounded-md border border-zinc-700 bg-zinc-950 p-3 text-white focus:border-orange-500 focus:outline-none resize-none"
                    required
                />
            </div>

            <div className="flex items-center justify-between">
                {message && <p className={`text-sm ${message.includes('error') || message.includes('Please') ? 'text-red-500' : 'text-green-500'}`}>{message}</p>}

                <button
                    type="submit"
                    disabled={loading}
                    className="ml-auto rounded-md bg-white px-6 py-2 font-bold text-black transition-colors hover:bg-gray-200 disabled:opacity-50 flex items-center gap-2"
                >
                    {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                    Submit Review
                </button>
            </div>
        </form>
    )
}
