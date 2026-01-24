import { login, signup, signInWithGoogle } from './actions'
import Link from 'next/link'

export default function LoginPage(props: {
    searchParams: { error?: string; message?: string }
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md rounded-lg border border-gray-800 bg-black p-8 shadow-lg">
                <h2 className="mb-6 text-center text-3xl font-bold text-orange-500">
                    Sign In
                </h2>

                {props.searchParams.error && (
                    <div className="mb-4 rounded bg-red-500/10 p-3 text-sm text-red-500 border border-red-500/20">
                        {props.searchParams.error}
                    </div>
                )}

                {props.searchParams.message && (
                    <div className="mb-4 rounded bg-green-500/10 p-3 text-sm text-green-500 border border-green-500/20">
                        {props.searchParams.message}
                    </div>
                )}

                <form action={async () => {
                    'use server'
                    await signInWithGoogle()
                }} className="mb-6">
                    <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-zinc-700 bg-white p-3 font-medium text-black hover:bg-gray-200 transition-colors">
                        <svg className="h-5 w-5" viewBox="0 0 24 24">
                            <path
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                fill="#4285F4"
                            />
                            <path
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                fill="#34A853"
                            />
                            <path
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                fill="#FBBC05"
                            />
                            <path
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                fill="#EA4335"
                            />
                        </svg>
                        Continue with Google
                    </button>
                </form>

                <div className="relative mb-6">
                    <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-black px-2 text-zinc-500">Or continue with email</span>
                    </div>
                </div>

                <form className="flex flex-col gap-4">
                    <div>
                        <label htmlFor="email" className="mb-2 block text-sm font-medium">
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full rounded border border-gray-700 bg-gray-900 p-2 text-white focus:border-orange-500 focus:outline-none"
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="mb-2 block text-sm font-medium">
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="w-full rounded border border-gray-700 bg-gray-900 p-2 text-white focus:border-orange-500 focus:outline-none"
                        />
                    </div>
                    <button
                        formAction={login}
                        className="mt-4 rounded bg-orange-600 px-4 py-2 font-bold text-white hover:bg-orange-500"
                    >
                        Log in
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Don&apos;t have an account?{' '}
                    <Link href="/register" className="text-orange-500 hover:underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    )
}
