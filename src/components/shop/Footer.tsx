import Link from 'next/link'

export function Footer() {
    return (
        <footer className="border-t border-gray-800 bg-black py-8 text-center text-gray-400">
            <div className="mb-4">
                &copy; {new Date().getFullYear()} TechDev Store. All rights reserved.
            </div>
            <div className="text-sm">
                <Link href="/login" className="text-gray-600 hover:text-gray-400 hover:underline">
                    Admin Access
                </Link>
            </div>
        </footer>
    )
}
