import { createClient } from '@/lib/supabase/server'
import { HomepageBuilder } from '@/components/admin/HomepageBuilder'

export default async function AdminHomepagePage() {
    const supabase = await createClient()

    // Fetch Products for selector
    const { data: products } = await supabase
        .from('products')
        .select('id, title, price, status')
        .eq('status', 'active')
        .order('created_at', { ascending: false })

    // Fetch Existing Sections
    const { data: heroSection } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'hero')
        .single()

    const { data: featuredSection } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'featured')
        .single()

    const { data: categoriesSection } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'categories')
        .single()

    const { data: sliderSection } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'hero_slider')
        .single()

    const { data: footerSection } = await supabase
        .from('homepage_sections')
        .select('*')
        .eq('section_type', 'footer')
        .single()

    return (
        <HomepageBuilder
            products={products || []}
            heroSection={heroSection}
            featuredSection={featuredSection}
            categoriesSection={categoriesSection}
            footerSection={footerSection}
            sliderSection={sliderSection}
        />
    )
}

