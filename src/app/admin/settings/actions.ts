'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateSettings(formData: FormData) {
    const supabase = await createClient()

    const site_name = formData.get('site_name') as string
    const description = formData.get('description') as string
    const contact_email = formData.get('contact_email') as string
    const maintenance_mode = formData.get('maintenance_mode') === 'on'
    const logo_url = formData.get('logo_url') as string
    const global_discount_percentage = parseFloat(formData.get('global_discount_percentage') as string || '0')
    const default_gst_percentage = parseFloat(formData.get('default_gst_percentage') as string || '18')

    const { error } = await supabase
        .from('site_settings')
        .upsert({
            id: 1,
            site_name,
            description,
            contact_email,
            maintenance_mode,
            logo_url,
            global_discount_percentage,
            default_gst_percentage,
            updated_at: new Date().toISOString()
        }, { onConflict: 'id' })

    if (error) {
        console.error('Error updating settings:', error)
        return { error: 'Failed to update settings' }
    }

    revalidatePath('/', 'layout') // Revalidate everything
    return { success: 'Settings updated successfully' }
}

// @ts-ignore
import { Client } from 'pg'

export async function fixDatabasePermissions() {
    // Only allow for admins - handled by authentication middleware on the route usually, 
    // but here we trust the admin panel context.

    if (!process.env.DATABASE_URL) {
        return { error: 'DATABASE_URL is not set' }
    }

    const client = new Client({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
    })

    try {
        await client.connect()

        // Fix Orders RLS
        await client.query(`
            ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
            ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

            DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
            DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
            DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
            DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;

            CREATE POLICY "Admins can view all orders" ON public.orders FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
            CREATE POLICY "Users can view own orders" ON public.orders FOR ALL USING ( auth.uid() = user_id );

            CREATE POLICY "Admins can view all order items" ON public.order_items FOR ALL USING ( (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' );
            CREATE POLICY "Users can view own order items" ON public.order_items FOR ALL USING ( EXISTS ( SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid() ) );
        `)

        return { success: 'Database permissions repaired successfully.' }
    } catch (e: any) {
        console.error('DB Fix Error:', e)
        return { error: 'Failed to fix database: ' + e.message }
    } finally {
        await client.end()
    }
}
