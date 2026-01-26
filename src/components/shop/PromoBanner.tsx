import { createClient as createServerClient } from '@/lib/supabase/server'
import { PromoBannerClient } from './PromoBannerClient'

const DEFAULT_PROMOS = [
    {
        id: 1,
        title: 'Limited Time',
        subtitle: 'Online Only!',
        description: 'Get free shipping on all orders over ₹2000.',
        icon: 'Clock',
        color: 'bg-orange-500',
        href: '/products?sort=newest',
        delay: 0
    },
    {
        id: 2,
        title: 'Extra Save',
        subtitle: '10% OFF',
        description: 'On all electronics this weekend.',
        icon: 'Tag',
        color: 'bg-blue-600',
        href: '/products?category=electronics',
        delay: 0.1
    },
    {
        id: 3,
        title: 'Security Network',
        subtitle: 'Cameras',
        description: 'Protect your home with smart tech.',
        icon: 'ShieldCheck',
        color: 'bg-red-600',
        href: '/search?category=security',
        delay: 0.2
    },
    {
        id: 4,
        title: 'Sale 50%',
        subtitle: 'Earbuds',
        description: 'Premium sound at half the price.',
        icon: 'Zap',
        color: 'bg-yellow-500',
        href: '/search?category=audio',
        delay: 0.3
    }
]

export async function PromoBanner() {
    const supabase = await createServerClient()
    const { data } = await supabase
        .from('homepage_sections')
        .select('content_json')
        .eq('section_type', 'promo_grid')
        .single()

    // Check if data.content_json exists and has cards, otherwise use default
    // Also handle case where content_json might be an empty object
    const promos = data?.content_json && Array.isArray(data.content_json.cards)
        ? data.content_json.cards
        : DEFAULT_PROMOS

    return <PromoBannerClient promos={promos} />
}
