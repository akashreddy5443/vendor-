import { login, signup } from './actions'
import Link from 'next/link'

export default function LoginPage(props: {
    searchParams: { error?: string; message?: string }
}) {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md rounded-lg border border-gray-800 bg-black p-8 shadow-lg">
                <h2 className="mb-6 text-center text-3xl font-bold text-orange-500">
                    Admin Login
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
