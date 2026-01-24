import Link from 'next/link'
import { ShoppingBag } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export async function Navbar() {
    const supabase = await createClient()
    const { data: announcement } = await supabase
        .from('homepage_sections')
        .select('content_json, is_active')
        .eq('section_type', 'announcement')
        .single()

    const showAnnouncement = announcement?.is_active && announcement?.content_json?.show !== false
    const text = announcement?.content_json?.text || ''
    const link = announcement?.content_json?.link || '#'

    return (
        <div className="flex flex-col">
            {showAnnouncement && (
                <div className="bg-orange-600 text-white text-xs font-bold py-2 text-center uppercase tracking-wider relative z-50">
                    {link && link !== '#' ? (
                        <Link href={link} className="hover:underline">
                            {text}
                        </Link>
                    ) : (
                        <span>{text}</span>
                    )}
                </div>
            )}

            <nav className="flex h-16 items-center justify-between border-b border-gray-800 bg-black px-6 text-white sticky top-0 z-40">
                <Link href="/" className="flex items-center gap-2 text-xl font-bold text-orange-500">
                    <ShoppingBag />
                    TechDev Store
                </Link>
                <div className="flex gap-6 text-sm font-medium text-gray-300">
                    <Link href="/products" className="hover:text-white transition-colors">Products</Link>
                    <Link href="/cart" className="hover:text-white transition-colors">Cart</Link>
                </div>
            </nav>
        </div>
    )
}
