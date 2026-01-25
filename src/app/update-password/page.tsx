'use client'

import { useState } from 'react'
import { updatePassword } from '../forgot-password/actions' // Reuse or duplicate actions if needed
import { Loader2, Lock } from 'lucide-react'

export default function UpdatePasswordPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError('')

        const res = await updatePassword(formData)
        if (res?.error) {
            setError(res.error)
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-md rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                <h2 className="text-2xl font-bold text-blue-500 mb-6 text-center">Set New Password</h2>

                {error && (
                    <div className="mb-4 rounded bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                        <input name="password" type="password" required minLength={6} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-blue-500 focus:outline-none" />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-blue-600 py-3 font-bold text-white hover:bg-blue-500 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Update Password
                    </button>
                </form>
            </div>
        </div>
    )
}
