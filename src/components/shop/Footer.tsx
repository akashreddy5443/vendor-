import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Globe, Mail, Phone, PackageCheck, RotateCcw, ShieldCheck } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { NewsletterForm } from '@/components/shop/NewsletterForm'

export async function Footer() {
    const supabase = await createClient()
    const { data: footerData } = await supabase
        .from('homepage_sections')
        .select('content_json')
        .eq('section_type', 'footer')
        .single()

    // Default Config with robust fallbacks
    const config = footerData?.content_json || {}
    const socialLinks = config.socialLinks || {}

    return (
        <footer className="border-t border-slate-100/5 bg-[#050a18] pt-24 text-white relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

                {/* Top Section: Newsletter & Value Props */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24 border-b border-white/5 pb-20">
                    <div className="space-y-8">
                        <div>
                            <span className="inline-block px-3 py-1 mb-6 rounded-full bg-blue-500/10 border border-blue-500/20 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400">
                                Protocol 2026
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-heading font-black tracking-tighter text-white mb-4">
                                Stay <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">Connected</span>
                            </h2>
                            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
                                Join our elite network for early access to experimental hardware and developer-first documentation.
                            </p>
                        </div>
                        <div className="max-w-md">
                            <NewsletterForm />
                        </div>
                    </div>

                    {/* Delivery & Trust Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-colors group">
                            <div className="h-10 w-10 rounded-lg bg-blue-500/10 flex items-center justify-center mb-4 text-blue-400 group-hover:text-blue-300 group-hover:scale-110 transition-all">
                                <PackageCheck className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-sm mb-1">Global Shipping</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                Free expedited delivery on all orders over ₹5,000. Tracked & insured.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-colors group">
                            <div className="h-10 w-10 rounded-lg bg-purple-500/10 flex items-center justify-center mb-4 text-purple-400 group-hover:text-purple-300 group-hover:scale-110 transition-all">
                                <RotateCcw className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-sm mb-1">30-Day Returns</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                No-questions-asked return policy for all sealed hardware.
                            </p>
                        </div>
                        <div className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-blue-500/20 transition-colors group sm:col-span-2">
                            <div className="h-10 w-10 rounded-lg bg-green-500/10 flex items-center justify-center mb-4 text-green-400 group-hover:text-green-300 group-hover:scale-110 transition-all">
                                <ShieldCheck className="h-5 w-5" />
                            </div>
                            <h4 className="font-bold text-sm mb-1">Secure Warranty</h4>
                            <p className="text-xs text-slate-500 leading-relaxed">
                                2-year manufacturer warranty included with every purchase.
                            </p>
                        </div>
                    </div>
                </div>

                {/* Main Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20 mb-20">

                    {/* Brand / Contact */}
                    <div className="col-span-2 md:col-span-1 space-y-8">
                        <Link href="/" className="text-2xl font-heading font-black tracking-tighter text-white inline-block">
                            TECH<span className="text-blue-500">DEV</span>
                        </Link>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Contact Support</h3>
                            <div className="space-y-2">
                                <a href="mailto:support@techdev.store" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group">
                                    <Mail className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                    support@techdev.store
                                </a>
                                <a href="tel:+18005550199" className="flex items-center gap-3 text-sm text-slate-400 hover:text-white transition-colors group">
                                    <Phone className="h-4 w-4 text-blue-500 group-hover:scale-110 transition-transform" />
                                    +1 (800) 555-0199
                                </a>
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {socialLinks.twitter && <Link href={socialLinks.twitter} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-black transition-all"><Twitter className="h-4 w-4" /></Link>}
                            {socialLinks.instagram && <Link href={socialLinks.instagram} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-black transition-all"><Instagram className="h-4 w-4" /></Link>}
                            {socialLinks.youtube && <Link href={socialLinks.youtube} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white hover:text-black transition-all"><Youtube className="h-4 w-4" /></Link>}
                        </div>
                    </div>

                    {/* Shop Links */}
                    <div>
                        <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Shop</h3>
                        <ul className="space-y-3 text-sm font-medium text-slate-400">
                            <li><Link href="/products" className="hover:text-white transition-colors">All Products</Link></li>
                            <li><Link href="/products?sort=newest" className="hover:text-white transition-colors">New Arrivals</Link></li>
                            <li><Link href="/products?category=laptops" className="hover:text-white transition-colors">Laptops</Link></li>
                            <li><Link href="/products?category=accessories" className="hover:text-white transition-colors">Accessories</Link></li>
                        </ul>
                    </div>

                    {/* Support Links */}
                    <div>
                        <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Support</h3>
                        <ul className="space-y-3 text-sm font-medium text-slate-400">
                            <li><Link href="/user/orders" className="hover:text-white transition-colors">Order Status</Link></li>
                            <li><Link href="/user/profile" className="hover:text-white transition-colors">My Account</Link></li>
                            <li><Link href="/help" className="hover:text-white transition-colors">Resolution Center</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact Us</Link></li>
                        </ul>
                    </div>

                    {/* Legal Links */}
                    <div>
                        <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-500">Legal</h3>
                        <ul className="space-y-3 text-sm font-medium text-slate-400">
                            <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                            <li><Link href="/shipping" className="hover:text-white transition-colors">Shipping Policy</Link></li>
                            <li><Link href="/refund" className="hover:text-white transition-colors">Refund Policy</Link></li>
                        </ul>
                    </div>
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/5 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-slate-600">
                        &copy; {new Date().getFullYear()} TechDev Store. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center font-black text-white text-[9px]">VISA</div>
                        <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center font-black text-white text-[9px]">MC</div>
                        <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center font-black text-white text-[9px]">UPI</div>
                    </div>
                </div>

            </div>
        </footer>
    )
}
