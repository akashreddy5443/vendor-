import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import { Metadata } from 'next'

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    const supabase = await createClient()
    const { data: page } = await supabase
        .from('pages')
        .select('title')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single()

    if (!page) return { title: 'Page Not Found' }

    return {
        title: `${page.title} | TechDev Store`,
    }
}

export default async function DynamicCMSPage({ params }: { params: { slug: string } }) {
    const supabase = await createClient()
    const { data: page } = await supabase
        .from('pages')
        .select('*')
        .eq('slug', params.slug)
        .eq('is_published', true)
        .single()

    if (!page) {
        notFound()
    }

    return (
        <div className="min-h-screen bg-background text-foreground py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                {/* Only show title if it's NOT the About page (since About handles its own hero) */}
                {page.slug !== 'about' && (
                    <h1 className="text-4xl font-bold mb-8 font-serif text-center">{page.title}</h1>
                )}

                <div
                    className="prose prose-invert prose-orange max-w-none dark:prose-p:text-gray-300 dark:prose-headings:text-white"
                    dangerouslySetInnerHTML={{ __html: page.content || '' }}
                />
            </div>
        </div>
    )
}
