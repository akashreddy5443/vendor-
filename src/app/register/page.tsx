'use client'

import { useState } from 'react'
import { signup } from './actions'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (formData: FormData) => {
        setLoading(true)
        setError('')

        const res = await signup(formData)
        if (res?.error) {
            setError(res.error)
            setLoading(false)
        }
        // Redirect happens in action
    }

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4">
            <div className="w-full max-w-lg rounded-xl border border-zinc-800 bg-zinc-900 p-8 shadow-2xl">
                <div className="mb-8 text-center">
                    <h2 className="text-3xl font-bold text-orange-500 mb-2">Create Account</h2>
                    <p className="text-gray-400">Join TechDev Store today</p>
                </div>

                {error && (
                    <div className="mb-6 rounded bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {error}
                    </div>
                )}

                <form action={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                            <input name="fullName" type="text" required className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input name="email" type="email" required className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <input name="password" type="password" required className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-orange-600 py-3 font-bold text-white hover:bg-orange-500 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        Create Account
                    </button>

                    <p className="text-center text-sm text-gray-500">
                        Already have an account?{' '}
                        <Link href="/login" className="text-orange-500 hover:underline">
                            Log in
                        </Link>
                    </p>
                </form>
            </div>
        </div>
    )
}
