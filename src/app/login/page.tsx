import { login, signup } from './actions'

export default function LoginPage() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-gray-900 text-white">
            <div className="w-full max-w-md rounded-lg border border-gray-800 bg-black p-8 shadow-lg">
                <h2 className="mb-6 text-center text-3xl font-bold text-orange-500">
                    TechDev Login
                </h2>
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
                    <button
                        formAction={signup}
                        className="mt-2 rounded border border-gray-700 bg-transparent px-4 py-2 font-bold text-gray-300 hover:bg-gray-800"
                    >
                        Sign up
                    </button>
                </form>
            </div>
        </div>
    )
}
