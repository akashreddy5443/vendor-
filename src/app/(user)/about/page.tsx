import { createClient } from '@/lib/supabase/server'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'About Us | TechDev Store',
    description: 'Learn more about TechDev Store and our mission.',
}

// Default Data (Fallback)
const DEFAULT_DATA = {
    pageTitle: "About TechDeveloper17",
    pageSubtitle: "Helping Brands Grow with Content",
    missionTitle: "Tech-Driven Brand Growth",
    missionDescription: "Empowering brands with technology-led content and modern digital solutions. Built to increase visibility, engagement, and growth. We specialize in simplifying complex tech topics into practical insights.",
    stats: [
        { value: "50K+", label: "Community Members" },
        { value: "100+", label: "Tech Reviews" }
    ],
    profile: {
        name: "Malikjan MJ",
        role: "Content Creator",
        bio: "I'm Malikjan, a tech influencer, content creator, and freelancer passionate about technology and electronics. I write blog articles that simplify complex tech topics into practical insights. My content focuses on innovation, gadgets, and real-world applications. This blog is built to make technology easy and accessible for everyone.",
        imageUrl: ""
    }
}

export default async function AboutPage() {
    const supabase = await createClient()

    // Try to fetch custom settings from DB
    const { data: section } = await supabase
        .from('homepage_sections')
        .select('content_json')
        .eq('section_type', 'about_page')
        .single()

    // Merge DB data with defaults to ensure all fields exist
    // If section exists, use it; otherwise use defaults
    const data = section?.content_json ? { ...DEFAULT_DATA, ...section.content_json } : DEFAULT_DATA

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-blue-500/30">
            <div className="min-h-[80vh] flex flex-col items-center justify-center text-center space-y-16 py-20 animate-in fade-in duration-700 px-6">

                {/* Hero Section */}
                <div className="space-y-6 max-w-4xl mx-auto">
                    <h1 className="text-4xl md:text-6xl font-black tracking-tight text-foreground mb-4">
                        {data.pageTitle}
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground font-light">
                        {data.pageSubtitle}
                    </p>
                </div>

                {/* Mission Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                    <span className="text-sm font-bold uppercase tracking-wider">Our Mission</span>
                </div>

                {/* Content Grid */}
                <div className="grid md:grid-cols-2 gap-12 w-full max-w-6xl mx-auto items-center text-left">

                    {/* Left: Text */}
                    <div className="space-y-8 p-8 rounded-3xl bg-card/80 border border-border backdrop-blur-sm hover:border-blue-500/30 transition-colors duration-500">
                        <h2 className="text-3xl font-bold text-foreground">{data.missionTitle}</h2>
                        <p className="text-muted-foreground leading-relaxed text-lg">
                            {data.missionDescription}
                        </p>

                        {data.stats && data.stats.length > 0 && (
                            <div className="grid grid-cols-2 gap-6 pt-4">
                                {data.stats.map((stat: any, i: number) => (
                                    <div key={i} className="p-4 rounded-2xl bg-muted/20 border border-border">
                                        <div className="text-3xl font-bold text-foreground mb-1">{stat.value}</div>
                                        <div className="text-sm text-muted-foreground">{stat.label}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Right: Profile Card */}
                    <div className="relative group">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-[2.5rem] blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500"></div>
                        <div className="relative bg-card border border-border rounded-[2.5rem] p-10 text-center space-y-6 overflow-hidden">

                            <div className="relative w-40 h-40 mx-auto rounded-full p-1 bg-gradient-to-tr from-blue-500 to-purple-500 transition-transform duration-700 ease-in-out hover:rotate-[360deg] cursor-pointer">
                                <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
                                    {data.profile?.imageUrl ? (
                                        <Image
                                            src={data.profile.imageUrl}
                                            alt={data.profile.name}
                                            fill
                                            className="object-cover"
                                        />
                                    ) : (
                                        <div className="absolute inset-0 flex items-center justify-center bg-muted text-muted-foreground">
                                            <svg className="w-20 h-20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div>
                                <h3 className="text-2xl font-bold text-foreground">{data.profile?.name}</h3>
                                <p className="text-blue-400 font-medium">{data.profile?.role}</p>
                            </div>

                            <div className="pt-6 border-t border-border">
                                <p className="text-muted-foreground text-sm italic leading-relaxed">
                                    "{data.profile?.bio}"
                                </p>
                            </div>

                            <div className="flex justify-center gap-4 pt-2">
                                <button className="p-2 rounded-full bg-muted text-foreground hover:bg-blue-600 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z" /></svg>
                                </button>
                                <button className="p-2 rounded-full bg-muted text-foreground hover:bg-pink-600 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>
                                </button>
                            </div>

                        </div>
                    </div>

                </div>
            </div>
        </div>
    )
}
