import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
        const { id, name, slug, icon, icon_bg_color, icon_color, custom_icon_url, image_url } = await request.json()

        console.log('API Route - Testing category update:', { id, name, slug, icon, icon_bg_color, icon_color, custom_icon_url, image_url })

        const supabase = await createClient()

        const { data, error } = await supabase
            .from('categories')
            .update({
                name,
                slug,
                icon,
                icon_bg_color,
                icon_color,
                custom_icon_url,
                image_url,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single()

        if (error) {
            console.error('Update error:', error)
            return NextResponse.json({ error: error.message }, { status: 500 })
        }

        console.log('Update successful:', data)
        return NextResponse.json({ success: true, data })
    } catch (error: any) {
        console.error('API Route error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}
