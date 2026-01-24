import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Globe, ArrowRight } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'

export async function Footer() {
    const supabase = await createClient()
    const { data: footerData } = await supabase
        .from('homepage_sections')
        .select('content_json')
        .eq('section_type', 'footer')
        .single()

    const config = footerData?.content_json || {
        newsletterTitle: "SUBSCRIBE TO OUR NEWSLETTER",
        socialLinks: {},
        infoLinks: [],
        supportLinks: []
    }

    return (
        <footer className="border-t border-gray-800 bg-black pt-16 pb-8 text-white">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

                    {/* Newsletter Section */}
                    <div className="space-y-6">
                        <h2 className="text-4xl font-extrabold tracking-tight text-white/90">
                            {/* Manual split for style, or dynamic if simple text */}
                            {config.newsletterTitle.includes('NEWSLETTER') ? (
                                <>
                                    <span className="text-blue-700">SUBSCRIBE</span> TO OUR <br />
                                    <span className="text-orange-500">NEWSLETTER</span>
                                </>
                            ) : (config.newsletterTitle)}
                        </h2>
                        <div className="relative max-w-md">
                            <input
                                type="email"
                                placeholder="Email"
                                className="w-full border-b border-gray-600 bg-transparent py-2 text-white placeholder-gray-500 focus:border-white focus:outline-none"
                            />
                            <button className="absolute right-0 top-2 text-gray-400 hover:text-white">
                                <ArrowRight className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="flex gap-4 pt-4 text-gray-400">
                            {config.socialLinks?.twitter && <Link href={config.socialLinks.twitter} className="hover:text-white"><Twitter className="h-5 w-5" /></Link>}
                            {config.socialLinks?.facebook && <Link href={config.socialLinks.facebook} className="hover:text-white"><Facebook className="h-5 w-5" /></Link>}
                            {config.socialLinks?.instagram && <Link href={config.socialLinks.instagram} className="hover:text-white"><Instagram className="h-5 w-5" /></Link>}
                            {config.socialLinks?.youtube && <Link href={config.socialLinks.youtube} className="hover:text-white"><Youtube className="h-5 w-5" /></Link>}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
                        <div>
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-200">Info</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                {config.infoLinks?.map((link: any, i: number) => (
                                    <li key={i}><Link href={link.url} className="hover:text-orange-500 transition-colors">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-gray-200">Support</h3>
                            <ul className="space-y-3 text-sm text-gray-400">
                                {config.supportLinks?.map((link: any, i: number) => (
                                    <li key={i}><Link href={link.url} className="hover:text-orange-500 transition-colors">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-gray-800 pt-8 sm:flex-row">

                    {/* Pickers */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 rounded border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-gray-500 cursor-pointer">
                            <Globe className="h-3 w-3" />
                            Global
                        </div>
                        <div className="flex items-center gap-2 rounded border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-gray-500 cursor-pointer">
                            English
                        </div>
                        <div className="flex items-center gap-2 rounded border border-gray-700 bg-gray-900 px-3 py-1.5 text-xs font-medium text-gray-300 hover:border-gray-500 cursor-pointer">
                            Dark Mode
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 sm:items-end">
                        <div className="text-xl font-bold font-serif tracking-tight">
                            TECH<span className="text-orange-500">DEV</span>
                        </div>
                        <div className="text-xs text-gray-500">
                            &copy; {new Date().getFullYear()} TechDev Store. Powered by Next.js
                        </div>
                    </div>
                </div>

                {/* Admin Link (Hidden/Subtle) */}
                <div className="mt-8 text-center">
                    <Link href="/login" className="text-[10px] text-gray-800 hover:text-gray-600">
                        Admin Access
                    </Link>
                </div>
            </div>
        </footer>
    )
}
