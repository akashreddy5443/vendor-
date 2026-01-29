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
        <footer className="border-t border-[#191970]/10 bg-[#191970] pt-20 pb-10 text-white transition-colors duration-300 font-sans">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-1 gap-16 lg:grid-cols-12">

                    {/* Newsletter Section */}
                    <div className="lg:col-span-5 space-y-8">
                        <h2 className="text-4xl lg:text-5xl font-extrabold tracking-incredibly-tight leading-none text-white uppercase">
                            {/* Manual split for style, or dynamic if simple text */}
                            <span className="block text-white/50 mb-2 text-2xl font-bold tracking-widest">Stay Ahead</span>
                            SUBSCRIBE TO OUR <br /><span className="text-blue-200">NEWSLETTER</span>
                        </h2>
                        <div className="relative max-w-sm">
                            <NewsletterForm />
                        </div>

                        <div className="flex gap-6 pt-6 text-white/60">
                            {config.socialLinks?.twitter && <Link href={config.socialLinks.twitter} className="hover:text-blue-400 hover:scale-110 transition-all"><Twitter className="h-6 w-6" /></Link>}
                            {config.socialLinks?.facebook && <Link href={config.socialLinks.facebook} className="hover:text-blue-500 hover:scale-110 transition-all"><Facebook className="h-6 w-6" /></Link>}
                            {config.socialLinks?.instagram && <Link href={config.socialLinks.instagram} className="hover:text-pink-500 hover:scale-110 transition-all"><Instagram className="h-6 w-6" /></Link>}
                            {config.socialLinks?.youtube && <Link href={config.socialLinks.youtube} className="hover:text-red-500 hover:scale-110 transition-all"><Youtube className="h-6 w-6" /></Link>}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8 pt-4">
                        <div>
                            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white/40">Info</h3>
                            <ul className="space-y-4 text-sm font-medium text-white/80">
                                {config.infoLinks?.map((link: any, i: number) => (
                                    <li key={i}><Link href={link.url} className="hover:text-white hover:translate-x-1 transition-all inline-block">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white/40">Support</h3>
                            <ul className="space-y-4 text-sm font-medium text-white/80">
                                {config.supportLinks?.map((link: any, i: number) => (
                                    <li key={i}><Link href={link.url} className="hover:text-white hover:translate-x-1 transition-all inline-block">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        {/* Extra Links Column for 'Professional' feel */}
                        <div>
                            <h3 className="mb-6 text-xs font-bold uppercase tracking-[0.2em] text-white/40">Legal</h3>
                            <ul className="space-y-4 text-sm font-medium text-white/80">
                                <li><Link href="/legal/terms" className="hover:text-white hover:translate-x-1 transition-all inline-block">Terms of Service</Link></li>
                                <li><Link href="/legal/privacy" className="hover:text-white hover:translate-x-1 transition-all inline-block">Privacy Policy</Link></li>
                                <li><Link href="/legal/shipping" className="hover:text-white hover:translate-x-1 transition-all inline-block">Shipping Policy</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Payment & Trust Badges (New Professional Section) */}
                <div className="mt-16 border-t border-white/10 pt-8 pb-8">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-center md:text-left">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">100% Secure Payments</h4>
                            <div className="flex gap-3 grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
                                {/* Simple CSS placeholders or SVG icons for Visa, MC, UPI */}
                                <div className="h-8 w-12 bg-white rounded flex items-center justify-center font-bold text-[#191970] text-[10px] italic border border-white/20">VISA</div>
                                <div className="h-8 w-12 bg-white rounded flex items-center justify-center font-bold text-red-600 text-[10px] border border-white/20">MC</div>
                                <div className="h-8 w-12 bg-white rounded flex items-center justify-center font-bold text-blue-600 text-[10px] border border-white/20">RUPAY</div>
                                <div className="h-8 w-12 bg-white rounded flex items-center justify-center font-bold text-green-600 text-[10px] border border-white/20">UPI</div>
                            </div>
                        </div>
                        <div className="text-center md:text-right">
                            <h4 className="text-xs font-bold uppercase tracking-widest text-white/50 mb-3">Trust & Certifications</h4>
                            <div className="flex gap-4 text-xs font-medium text-white/60">
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-green-500"></div> SSL Encrypted</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-blue-500"></div> Verified Seller</span>
                                <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-yellow-500"></div> 100% Authentic</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="flex flex-col items-center justify-between gap-8 border-t border-white/10 pt-10 sm:flex-row">

                    {/* Pickers */}
                    <div className="flex gap-4">
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-wide text-white/70 hover:bg-white/10 cursor-pointer transition-colors">
                            <Globe className="h-3 w-3" />
                            Global
                        </div>
                        <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold tracking-wide text-white/70 hover:bg-white/10 cursor-pointer transition-colors">
                            English
                        </div>
                    </div>

                    <div className="flex flex-col items-center gap-2 sm:items-end">
                        <div className="text-2xl font-black font-sans tracking-tight text-white">
                            {config.copyrightText || (
                                <>TECH<span className="text-blue-300">DEV</span></>
                            )}
                        </div>
                        <div className="text-xs text-white/40 text-center sm:text-right font-medium">
                            <p>&copy; {new Date().getFullYear()} {config.copyrightText || 'TechDev Store'}. All rights reserved.</p>
                        </div>
                    </div>
                </div>

                {/* Admin Link (Hidden/Subtle) */}
                <div className="mt-10 text-center">
                    <Link href="/login" className="text-[10px] text-white/10 hover:text-white/30 uppercase tracking-widest font-bold">
                        Admin Access
                    </Link>
                </div>
            </div>
        </footer>
    )
}
