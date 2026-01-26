import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Globe } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { NewsletterForm } from '@/components/shop/NewsletterForm'

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
        <footer className="border-t border-white/10 bg-[#0B1026] pt-16 pb-8 text-white transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">

                    {/* Newsletter Section */}
                    <div className="space-y-6">
                        <h2 className="text-4xl font-extrabold tracking-tight text-white">
                            {/* Manual split for style, or dynamic if simple text */}
                            {config.newsletterTitle.includes('NEWSLETTER') ? (
                                <>
                                    <span className="text-blue-500">SUBSCRIBE</span> TO OUR <br />
                                    <span className="text-white">NEWSLETTER</span>
                                </>
                            ) : (config.newsletterTitle)}
                        </h2>
                        <div className="relative max-w-md">
                            <NewsletterForm />
                        </div>

                        <div className="flex gap-4 pt-4 text-gray-400">
                            {config.socialLinks?.twitter && <Link href={config.socialLinks.twitter} className="hover:text-sky-500 transition-colors"><Twitter className="h-5 w-5" /></Link>}
                            {config.socialLinks?.facebook && <Link href={config.socialLinks.facebook} className="hover:text-blue-600 transition-colors"><Facebook className="h-5 w-5" /></Link>}
                            {config.socialLinks?.instagram && <Link href={config.socialLinks.instagram} className="hover:text-pink-600 transition-colors"><Instagram className="h-5 w-5" /></Link>}
                            {config.socialLinks?.youtube && <Link href={config.socialLinks.youtube} className="hover:text-red-600 transition-colors"><Youtube className="h-5 w-5" /></Link>}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="grid grid-cols-2 gap-8 sm:grid-cols-2">
                        <div>
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">Info</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {config.infoLinks?.map((link: any, i: number) => (
                                    <li key={i}><Link href={link.url} className="hover:text-primary transition-colors">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-foreground">Support</h3>
                            <ul className="space-y-3 text-sm text-muted-foreground">
                                {config.supportLinks?.map((link: any, i: number) => (
                                    <li key={i}><Link href={link.url} className="hover:text-primary transition-colors">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="mt-16 flex flex-col items-center justify-between gap-6 border-t border-border pt-8 sm:flex-row">

                    {/* Pickers */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 rounded border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-foreground/20 cursor-pointer">
                            <Globe className="h-3 w-3" />
                            Global
                        </div>
                        <div className="flex items-center gap-2 rounded border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:border-foreground/20 cursor-pointer">
                            English
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 sm:items-end">
                        <div className="text-xl font-bold font-serif tracking-tight">
                            TECH<span className="text-primary">DEV</span>
                        </div>
                        <div className="text-xs text-muted-foreground">
                            &copy; {new Date().getFullYear()} TechDev Store. Powered by Next.js
                        </div>
                    </div>
                </div>

                {/* Admin Link (Hidden/Subtle) */}
                <div className="mt-8 text-center">
                    <Link href="/login" className="text-[10px] text-muted-foreground hover:text-foreground">
                        Admin Access
                    </Link>
                </div>
            </div>
        </footer>
    )
}
