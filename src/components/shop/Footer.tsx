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
        <footer className="border-t border-slate-100/10 bg-[#0B1026] pt-24 pb-12 text-white transition-colors duration-300">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="grid grid-cols-grid-cols-1 gap-20 lg:grid-cols-12">

                    {/* Newsletter Section */}
                    <div className="lg:col-span-12 xl:col-span-5 space-y-10">
                        <div className="space-y-4">
                            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-[0.3em] text-primary">Protocol 2026</span>
                            <h2 className="text-5xl lg:text-7xl font-heading font-black tracking-tighter leading-[0.9] text-white">
                                Stay <span className="text-primary">Informed</span>
                            </h2>
                            <p className="max-w-md text-slate-400 text-sm font-medium leading-relaxed">
                                Join our elite network for early access to experimental hardware and developer-first documentation.
                            </p>
                        </div>

                        <div className="relative max-w-md">
                            <NewsletterForm />
                        </div>

                        <div className="flex gap-8 pt-4">
                            {config.socialLinks?.twitter && <Link href={config.socialLinks.twitter} className="text-slate-500 hover:text-primary transition-all hover:scale-125 transform duration-500"><Twitter className="h-6 w-6" /></Link>}
                            {config.socialLinks?.facebook && <Link href={config.socialLinks.facebook} className="text-slate-500 hover:text-primary transition-all hover:scale-125 transform duration-500"><Facebook className="h-6 w-6" /></Link>}
                            {config.socialLinks?.instagram && <Link href={config.socialLinks.instagram} className="text-slate-500 hover:text-primary transition-all hover:scale-125 transform duration-500"><Instagram className="h-6 w-6" /></Link>}
                            {config.socialLinks?.youtube && <Link href={config.socialLinks.youtube} className="text-slate-500 hover:text-primary transition-all hover:scale-125 transform duration-500"><Youtube className="h-6 w-6" /></Link>}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div className="lg:col-span-12 xl:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-12">
                        <div>
                            <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Navigation</h3>
                            <ul className="space-y-4 text-sm font-bold text-slate-400">
                                {config.infoLinks?.map((link: any, i: number) => (
                                    <li key={i}><Link href={link.url} className="hover:text-primary hover:translate-x-2 transition-all duration-500 inline-block">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Resource Hub</h3>
                            <ul className="space-y-4 text-sm font-bold text-slate-400">
                                {config.supportLinks?.map((link: any, i: number) => (
                                    <li key={i}><Link href={link.url} className="hover:text-primary hover:translate-x-2 transition-all duration-500 inline-block">{link.label}</Link></li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <h3 className="mb-8 text-[11px] font-black uppercase tracking-[0.3em] text-slate-500">Legal Directives</h3>
                            <ul className="space-y-4 text-sm font-bold text-slate-400">
                                <li><Link href="/legal/terms" className="hover:text-primary hover:translate-x-2 transition-all duration-500 inline-block">Terms of Access</Link></li>
                                <li><Link href="/legal/privacy" className="hover:text-primary hover:translate-x-2 transition-all duration-500 inline-block">Privacy Protocol</Link></li>
                                <li><Link href="/legal/shipping" className="hover:text-primary hover:translate-x-2 transition-all duration-500 inline-block">Logistics Terms</Link></li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Trust & Verification */}
                <div className="mt-24 border-t border-white/5 pt-12 pb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 items-center gap-12">
                        <div className="flex flex-col sm:flex-row items-center gap-8">
                            <div className="shrink-0">
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 text-center sm:text-left">Encrypted Transactions</h4>
                                <div className="flex gap-4 opacity-50 hover:opacity-100 transition-opacity duration-700">
                                    <div className="h-10 w-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-black text-white text-[11px] uppercase tracking-tighter">Visa</div>
                                    <div className="h-10 w-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-black text-white text-[11px] uppercase tracking-tighter">MC</div>
                                    <div className="h-10 w-16 bg-white/5 rounded-xl border border-white/10 flex items-center justify-center font-black text-white text-[11px] uppercase tracking-tighter">UPI</div>
                                </div>
                            </div>
                            <div className="h-12 w-[1px] bg-white/5 hidden sm:block" />
                            <div>
                                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4 text-center sm:text-left">Operational Security</h4>
                                <div className="flex flex-wrap justify-center sm:justify-start gap-6">
                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> SSL Secured
                                    </span>
                                    <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <div className="w-1.5 h-1.5 rounded-full bg-primary" /> Verified Hub
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-center lg:justify-end gap-6">
                            <div className="flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer transition-all duration-500">
                                <Globe className="h-3.5 w-3.5" /> Global Access
                            </div>
                            <div className="flex items-center gap-3 rounded-full border border-white/5 bg-white/5 px-6 py-3 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:bg-white/10 hover:text-white cursor-pointer transition-all duration-500">
                                Localization: EN
                            </div>
                        </div>
                    </div>
                </div>

                {/* Root Copyright */}
                <div className="flex flex-col items-center justify-between gap-10 border-t border-white/5 pt-12 text-center lg:flex-row lg:text-left">
                    <div className="flex flex-col gap-3">
                        <Link href="/" className="text-3xl font-heading font-black tracking-tighter text-white group">
                            TECH<span className="text-primary group-hover:text-white transition-colors">DEV</span>
                        </Link>
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-600">
                            Authorized TechDev Laboratory Hub &copy; {new Date().getFullYear()}
                        </p>
                    </div>

                    <div className="flex flex-col lg:items-end gap-4">
                        <p className="text-[10px] font-bold text-slate-500 max-w-xs lg:text-right leading-relaxed uppercase tracking-widest">
                            Precision crafted for developer environments and enterprise-grade operational excellence.
                        </p>
                        <Link href="/login" className="text-[9px] text-slate-700 hover:text-primary uppercase font-black tracking-[0.5em] transition-colors">
                            Admin System Access
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
