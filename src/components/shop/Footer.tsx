import Link from 'next/link'
import { Facebook, Twitter, Instagram, Youtube, Globe, Mail, Phone, PackageCheck, RotateCcw, ShieldCheck, Tag, HelpCircle, FileText } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { NewsletterForm } from '@/components/shop/NewsletterForm'

// Map string icon names to Lucide components
const ICON_MAP: any = {
    Facebook, Twitter, Instagram, Youtube, Globe, Mail, Phone, PackageCheck, RotateCcw, ShieldCheck, Tag, HelpCircle, FileText
}

export async function Footer() {
    const supabase = await createClient()
    const { data: footerData } = await supabase
        .from('homepage_sections')
        .select('content_json')
        .eq('section_type', 'footer')
        .single()

    // Default Config (Billionaire Style)
    const defaults = {
        style: {
            backgroundColor: '#050a18',
            textColor: '#ffffff',
            accentColor: '#3b82f6'
        },
        contact: {
            email: 'support@techdev.store',
            phone: '+1 (800) 555-0199'
        },
        socialLinks: {},
        trustBadges: [
            { icon: 'PackageCheck', title: 'Global Shipping', desc: 'Free expedited delivery on all orders over ₹5,000. Tracked & insured.' },
            { icon: 'RotateCcw', title: '30-Day Returns', desc: 'No-questions-asked return policy for all sealed hardware.' },
            { icon: 'ShieldCheck', title: 'Secure Warranty', desc: '2-year manufacturer warranty included with every purchase.' }
        ],
        linkGroups: [
            {
                title: 'Shop', links: [
                    { label: 'All Products', href: '/products' },
                    { label: 'New Arrivals', href: '/products?sort=newest' },
                    { label: 'Laptops', href: '/products?category=laptops' },
                    { label: 'Accessories', href: '/products?category=accessories' }
                ]
            },
            {
                title: 'Support', links: [
                    { label: 'Order Status', href: '/user/orders' },
                    { label: 'My Account', href: '/user/profile' },
                    { label: 'Resolution Center', href: '/help' },
                    { label: 'Contact Us', href: '/contact' }
                ]
            },
            {
                title: 'Legal', links: [
                    { label: 'Terms of Service', href: '/terms' },
                    { label: 'Privacy Policy', href: '/privacy' },
                    { label: 'Shipping Policy', href: '/shipping' },
                    { label: 'Refund Policy', href: '/refund' }
                ]
            }
        ],
        copyrightText: 'TECHDEV',
        creditsText: 'Authorized TechDev Laboratory Hub'
    }

    // Logic: Use DB config if it has the new 'style' structure, otherwise fall back to defaults
    const config = footerData?.content_json?.style ? footerData.content_json : defaults
    const { style, contact, socialLinks, trustBadges, linkGroups, copyrightText, creditsText } = config

    return (
        <footer
            className="border-t border-slate-100/5 pt-24 relative overflow-hidden transition-colors duration-500"
            style={{ backgroundColor: style.backgroundColor, color: style.textColor }}
        >
            {/* Background Glow */}
            <div
                className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none opacity-10"
                style={{ backgroundColor: style.accentColor }}
            />

            <div className="mx-auto max-w-7xl px-6 lg:px-8 relative z-10">

                {/* Top Section: Newsletter & Value Props */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 mb-24 border-b border-white/5 pb-20">
                    <div className="space-y-8">
                        <div>
                            <span
                                className="inline-block px-3 py-1 mb-6 rounded-full border text-[10px] font-black uppercase tracking-[0.2em]"
                                style={{ borderColor: `${style.accentColor}33`, backgroundColor: `${style.accentColor}1A`, color: style.accentColor }}
                            >
                                Protocol 2026
                            </span>
                            <h2 className="text-4xl lg:text-5xl font-heading font-black tracking-tighter mb-4">
                                Stay <span className="text-transparent bg-clip-text" style={{ backgroundImage: `linear-gradient(to right, ${style.accentColor}, #a855f7)` }}>Connected</span>
                            </h2>
                            <p className="text-xs font-medium opacity-60 leading-relaxed max-w-sm">
                                Join our elite network for early access to experimental hardware and developer-first documentation.
                            </p>
                        </div>
                        <div className="max-w-md">
                            <NewsletterForm />
                        </div>
                    </div>

                    {/* Delivery & Trust Summary */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                        {trustBadges?.map((badge: any, idx: number) => {
                            const Icon = ICON_MAP[badge.icon] || ShieldCheck
                            return (
                                <div key={idx} className={`p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-white/10 transition-colors group ${idx === 2 ? 'sm:col-span-2' : ''}`}>
                                    <div
                                        className="h-10 w-10 rounded-lg flex items-center justify-center mb-4 transition-all group-hover:scale-110"
                                        style={{ backgroundColor: `${style.accentColor}1A`, color: style.accentColor }}
                                    >
                                        <Icon className="h-5 w-5" />
                                    </div>
                                    <h4 className="font-bold text-sm mb-1">{badge.title}</h4>
                                    <p className="text-xs opacity-50 leading-relaxed">
                                        {badge.desc}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Main Links Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-12 lg:gap-20 mb-20">

                    {/* Brand / Contact */}
                    <div className="col-span-2 md:col-span-1 space-y-8">
                        <Link href="/" className="text-2xl font-heading font-black tracking-tighter inline-block">
                            {copyrightText}
                        </Link>

                        <div className="space-y-4">
                            <h3 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50">Contact Support</h3>
                            <div className="space-y-2">
                                {contact.email && (
                                    <a href={`mailto:${contact.email}`} className="flex items-center gap-3 text-sm opacity-60 hover:opacity-100 transition-opacity group">
                                        <Mail className="h-4 w-4 transition-transform group-hover:scale-110" style={{ color: style.accentColor }} />
                                        {contact.email}
                                    </a>
                                )}
                                {contact.phone && (
                                    <a href={`tel:${contact.phone}`} className="flex items-center gap-3 text-sm opacity-60 hover:opacity-100 transition-opacity group">
                                        <Phone className="h-4 w-4 transition-transform group-hover:scale-110" style={{ color: style.accentColor }} />
                                        {contact.phone}
                                    </a>
                                )}
                            </div>
                        </div>

                        <div className="flex gap-4">
                            {socialLinks?.twitter && <Link href={socialLinks.twitter} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-white hover:text-black transition-all"><Twitter className="h-4 w-4" /></Link>}
                            {socialLinks?.instagram && <Link href={socialLinks.instagram} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-white hover:text-black transition-all"><Instagram className="h-4 w-4" /></Link>}
                            {socialLinks?.youtube && <Link href={socialLinks.youtube} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-white hover:text-black transition-all"><Youtube className="h-4 w-4" /></Link>}
                            {socialLinks?.facebook && <Link href={socialLinks.facebook} className="h-8 w-8 rounded-full bg-white/5 flex items-center justify-center opacity-60 hover:opacity-100 hover:bg-white hover:text-black transition-all"><Facebook className="h-4 w-4" /></Link>}
                        </div>
                    </div>

                    {/* Dynamic Link Groups */}
                    {linkGroups?.map((group: any, idx: number) => (
                        <div key={idx}>
                            <h3 className="mb-6 text-[11px] font-black uppercase tracking-[0.2em] opacity-50">{group.title}</h3>
                            <ul className="space-y-3 text-sm font-medium opacity-60">
                                {group.links.map((link: any, linkIdx: number) => (
                                    <li key={linkIdx}>
                                        <Link href={link.href} className="hover:text-white hover:opacity-100 transition-colors hover:translate-x-1 inline-block duration-300">
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Footer Bottom */}
                <div className="border-t border-white/5 py-8 flex flex-col md:flex-row justify-between items-center gap-6">
                    <p className="text-[10px] font-bold uppercase tracking-[0.1em] opacity-60">
                        &copy; {new Date().getFullYear()} {creditsText}. All rights reserved.
                    </p>

                    <div className="flex items-center gap-4 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                        <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center font-black text-[9px]">VISA</div>
                        <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center font-black text-[9px]">MC</div>
                        <div className="h-8 w-12 bg-white/5 rounded border border-white/10 flex items-center justify-center font-black text-[9px]">UPI</div>
                    </div>
                </div>

            </div>
        </footer>
    )
}
