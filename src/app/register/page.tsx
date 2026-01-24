'use client'

import { useState } from 'react'
import { signup } from './actions'
import Link from 'next/link'
import { Loader2 } from 'lucide-react'

export default function RegisterPage() {
    const [isStudent, setIsStudent] = useState(false)
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
                            <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                            <input name="email" type="email" required className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
                            <input name="password" type="password" required className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                        </div>
                    </div>

                    {/* Student Toggle */}
                    <div className="flex items-center gap-3 p-4 rounded-lg bg-zinc-800/50 border border-zinc-700">
                        <input
                            type="checkbox"
                            name="isStudent"
                            id="isStudent"
                            checked={isStudent}
                            onChange={(e) => setIsStudent(e.target.checked)}
                            className="h-5 w-5 rounded border-gray-600 bg-gray-700 text-orange-600 focus:ring-orange-500"
                        />
                        <label htmlFor="isStudent" className="font-medium cursor-pointer select-none">
                            I am a Student (Register for benefits)
                        </label>
                    </div>

                    {/* Conditional Fields */}
                    {isStudent && (
                        <div className="space-y-6 animate-in slide-in-from-top-4 duration-300">
                            <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 space-y-4">
                                <h3 className="font-semibold text-orange-400">Student Information</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">University Name</label>
                                    <input name="universityName" required={isStudent} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Student ID / Roll No</label>
                                    <input name="universityId" required={isStudent} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                                </div>
                            </div>

                            <div className="p-4 rounded-lg bg-zinc-800/30 border border-zinc-700/50 space-y-4">
                                <h3 className="font-semibold text-orange-400">Address Details</h3>
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-1">Street Address</label>
                                    <input name="street" required={isStudent} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">City</label>
                                        <input name="city" required={isStudent} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-1">Zip Code</label>
                                        <input name="zip" required={isStudent} className="w-full rounded-lg border border-zinc-700 bg-zinc-800 p-3 text-white focus:border-orange-500 focus:outline-none" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-lg bg-orange-600 py-3 font-bold text-white hover:bg-orange-500 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isStudent ? 'Register as Student' : 'Create Account'}
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
