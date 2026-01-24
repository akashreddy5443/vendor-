'use client'

import { useState } from 'react'
import { resetPassword } from './actions'
import Link from 'next/link'
import { Loader2, ArrowLeft, Mail } from 'lucide-react'

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [error, setError] = useState('')

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError('')
        setMessage('')

        const res = await resetPassword(formData)

        if (res?.error) {
            setError(res.error)
        } else {
            setMessage('Check your email for the password reset link.')
        }
        setLoading(false)
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                <Link href="/login" className="flex items-center text-sm text-gray-400 hover:text-white mb-6">
                    <ArrowLeft className="h-4 w-4 mr-1" /> Back to Login
                </Link>

                <h2 className="text-2xl font-bold text-orange-500 mb-2">Reset Password</h2>
                <p className="text-gray-400 mb-6">Enter your email and we'll send you a link to get back into your account.</p>

                {error && (
                    <div className="mb-4 rounded bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                {message ? (
                    <div className="text-center py-8">
                        <div className="bg-green-500/10 h-16 w-16 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Mail className="h-8 w-8 text-green-500" />
                        </div>
                        <h3 className="text-lg font-bold text-white mb-2">Check your email</h3>
                        <p className="text-gray-400">{message}</p>
                    </div>
                ) : (
                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email Address</label>
                            <input name="email" type="email" required className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-lg bg-orange-600 py-3 font-bold text-white hover:bg-orange-500 disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                            Send Reset Link
                        </button>
                    </form>
                )}
            </div>
        </div>
    )
}
