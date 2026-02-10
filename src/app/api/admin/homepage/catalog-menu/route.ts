import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        // Find existing catalog_menu section
        const { data: existing } = await supabase
            .from('homepage_sections')
            .select('id')
            .eq('section_type', 'catalog_menu')
            .single()

        const payload = {
            section_type: 'catalog_menu',
            title: 'Catalog Menu',
            content_json: body,  // Changed from 'content' to 'content_json'
            is_active: true,
        }

        let error
        if (existing) {
            const { error: updateError } = await supabase
                .from('homepage_sections')
                .update(payload)
                .eq('id', existing.id)
            error = updateError
        } else {
            const { error: insertError } = await supabase
                .from('homepage_sections')
                .insert(payload)
            error = insertError
        }

        if (error) {
            console.error('Database error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Revalidate frontend to show changes immediately
        revalidatePath('/', 'layout')
        revalidatePath('/admin/homepage')

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('API error:', error)
        return NextResponse.json({ error: error.message || 'Failed to save' }, { status: 500 })
    }
}
