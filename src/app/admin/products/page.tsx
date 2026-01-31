import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'
import { ProductTable } from '@/components/admin/ProductTable'

import { AdminSearch } from '@/components/admin/AdminSearch'

export default async function AdminProductsPage({
    searchParams,
}: {
    searchParams: Promise<{ q?: string }>
}) {
    const params = await searchParams
    const query = params.q || ''

    const supabase = await createClient()

    let dbQuery = supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    if (query) {
        dbQuery = dbQuery.ilike('title', `%${query}%`)
    }

    const { data: products, error } = await dbQuery

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-gray-900">Products</h2>
                    <p className="text-gray-500">Manage your store's products.</p>
                </div>
                <div className="flex items-center gap-4">
                    <AdminSearch />
                    <Link
                        href="/admin/products/new"
                        className="flex items-center gap-2 rounded bg-blue-600 px-4 py-2 font-bold text-white transition-colors hover:bg-blue-500"
                    >
                        <Plus className="h-4 w-4" />
                        Add Product
                    </Link>
                </div>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                {/* We'll separate the table into a client component for interactivity if needed, 
            but for now, a simple server render is fine, or a client component for actions */}
                <ProductTable products={products || []} />
            </div>
        </div>
    )
}
