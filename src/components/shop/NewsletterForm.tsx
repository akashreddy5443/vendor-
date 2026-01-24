'use client'

import { useState } from 'react'
import { ArrowRight, Check, Loader2 } from 'lucide-react'
import { subscribeToNewsletter } from '@/app/actions/newsletter'

export function NewsletterForm() {
    const [email, setEmail] = useState('')
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
    const [message, setMessage] = useState('')

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setStatus('loading')
        setMessage('')

        const formData = new FormData()
        formData.append('email', email)

        const result = await subscribeToNewsletter(formData)

        if (result.error) {
            setStatus('error')
            setMessage(result.error)
        } else {
            setStatus('success')
            setMessage(result.message || 'Subscribed!')
            setEmail('')
        }
    }

    return (
        <form onSubmit={handleSubmit} className="relative max-w-md">
            <div className="relative">
                <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Email"
                    disabled={status === 'loading' || status === 'success'}
                    className="w-full border-b border-muted-foreground/30 bg-transparent py-2 text-foreground placeholder-muted-foreground focus:border-primary focus:outline-none disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={status === 'loading' || status === 'success'}
                    className="absolute right-0 top-2 text-muted-foreground hover:text-foreground disabled:opacity-50"
                >
                    {status === 'loading' ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : status === 'success' ? (
                        <Check className="h-5 w-5 text-green-500" />
                    ) : (
                        <ArrowRight className="h-5 w-5" />
                    )}
                </button>
            </div>
            {message && (
                <p className={`mt-2 text-xs ${status === 'error' ? 'text-red-500' : 'text-green-500'}`}>
                    {message}
                </p>
            )}
        </form>
    )
}
