import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const supabase = await createClient()
        const body = await request.json()

        // Upsert to homepage_sections table
        const { error } = await supabase
            .from('homepage_sections')
            .upsert({
                section_type: 'catalog_menu',
                content: body,
                updated_at: new Date().toISOString()
            }, {
                onConflict: 'section_type'
            })

        if (error) {
            console.error('Database error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        // Revalidate frontend to show changes immediately
        revalidatePath('/', 'layout')

        return NextResponse.json({ success: true })
    } catch (error: any) {
        console.error('API error:', error)
        return NextResponse.json({ error: error.message || 'Failed to save' }, { status: 500 })
    }
}
