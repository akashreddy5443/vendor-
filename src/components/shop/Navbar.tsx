import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'

export function Navbar() {
    return (
        <nav className="flex h-16 items-center justify-between border-b border-gray-800 bg-black px-6 text-white">
            <Link href="/" className="flex items-center gap-2 text-xl font-bold text-orange-500">
                <ShoppingBag />
                TechDev Store
            </Link>
            <div className="flex gap-6 text-sm font-medium text-gray-300">
                <Link href="/products" className="hover:text-white transition-colors">Products</Link>
                <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
            </div>
        </nav>
    )
}
