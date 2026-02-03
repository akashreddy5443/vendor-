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
    const min_price_filter = parseFloat(formData.get('min_price_filter') as string || '0')
    const max_price_filter = parseFloat(formData.get('max_price_filter') as string || '100000')

    // Tax Configuration
    const tax_label = formData.get('tax_label') as string || 'GST'
    const tax_breakdown_enabled = formData.get('tax_breakdown_enabled') === 'on'

    // Sidebar Configuration
    const filter_category_label = formData.get('filter_category_label') as string
    const filter_brand_label = formData.get('filter_brand_label') as string
    const show_category_filter = formData.get('show_category_filter') === 'on'
    const show_brand_filter = formData.get('show_brand_filter') === 'on'

    // Parse hidden_categories
    let hidden_categories = []
    try {
        const hiddenRaw = formData.get('hidden_categories') as string
        if (hiddenRaw) {
            hidden_categories = JSON.parse(hiddenRaw)
        }
    } catch (e) {
        console.error('Invalid JSON for hidden_categories:', e)
    }

    // Parse price_presets safely
    let price_presets = null
    try {
        const presetsRaw = formData.get('price_presets') as string
        if (presetsRaw) {
            price_presets = JSON.parse(presetsRaw)
        }
    } catch (e) {
        console.error('Invalid JSON for price_presets:', e)
        // Keep null to avoid breaking DB if invalid
    }

    const updateData: any = {
        id: 1,
        site_name,
        description,
        contact_email,
        maintenance_mode,
        logo_url,
        global_discount_percentage,
        default_gst_percentage,
        min_price_filter,
        max_price_filter,
        filter_category_label,
        filter_brand_label,
        show_category_filter,
        show_brand_filter,
        hidden_categories,
        tax_label,
        tax_breakdown_enabled,
        updated_at: new Date().toISOString()
    }

    if (price_presets) {
        updateData.price_presets = price_presets
    }

    const { error } = await supabase
        .from('site_settings')
        .upsert(updateData, { onConflict: 'id' })

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

    // Try multiple possible environment variables for the connection string
    const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || process.env.POSTGRES_PRISMA_URL;

    if (!connectionString) {
        return { error: 'Database connection string not found (checked DATABASE_URL, POSTGRES_URL, POSTGRES_PRISMA_URL)' }
    }

    const client = new Client({
        connectionString: connectionString,
        ssl: {
            rejectUnauthorized: false,
            // Sometimes simply setting checkServerIdentity to returns undefined helps in some Node versions
            checkServerIdentity: () => undefined
        }
    })

    try {
        await client.connect()

        // Fix Orders RLS (Permissive Mode for Debugging)
        await client.query(`
            ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
            ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

            DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
            DROP POLICY IF EXISTS "Users can view own orders" ON public.orders;
            DROP POLICY IF EXISTS "Admins can view all order items" ON public.order_items;
            DROP POLICY IF EXISTS "Users can view own order items" ON public.order_items;

            -- Admin Policy (Check role OR specific email for safety during dev)
            CREATE POLICY "Admins can view all orders" ON public.orders FOR ALL USING ( 
                (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin' 
                OR auth.jwt() ->> 'email' = 'malikjanmj2@gmail.com'
            );
            
            CREATE POLICY "Users can view own orders" ON public.orders FOR ALL USING ( auth.uid() = user_id );

            -- Order Items Policy
            CREATE POLICY "Admins can view all order items" ON public.order_items FOR ALL USING ( 
                (SELECT role FROM public.users WHERE id = auth.uid()) = 'admin'
                OR auth.jwt() ->> 'email' = 'malikjanmj2@gmail.com'
            );
            
            CREATE POLICY "Users can view own order items" ON public.order_items FOR ALL USING ( 
                EXISTS ( SELECT 1 FROM public.orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid() ) 
            );
        `)

        const res = await client.query('SELECT count(*) as order_count FROM public.orders; SELECT count(*) as item_count FROM public.order_items;')
        // Note: client.query doesn't support multiple statements well for return values in all drivers, so better to run separate or parse carefully.
        // Assuming simple execution:
        const orderCount = await client.query('SELECT count(*) FROM public.orders')
        const itemCount = await client.query('SELECT count(*) FROM public.order_items')

        return { success: `Permissions Fixed. DB Stats - Orders: ${orderCount.rows[0].count}, Items: ${itemCount.rows[0].count}` }
    } catch (e: any) {
        console.error('DB Fix Error:', e)
        return { error: 'Failed to fix database: ' + e.message }
    } finally {
        await client.end()
    }
}
