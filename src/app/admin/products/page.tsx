import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { Plus } from 'lucide-react'
import { ProductTable } from '@/components/admin/ProductTable'

export default async function AdminProductsPage() {
    const supabase = await createClient()
    const { data: products, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-white">Products</h2>
                    <p className="text-gray-400">Manage your store's products.</p>
                </div>
                <Link
                    href="/admin/products/new"
                    className="flex items-center gap-2 rounded bg-orange-600 px-4 py-2 font-bold text-white transition-colors hover:bg-orange-500"
                >
                    <Plus className="h-4 w-4" />
                    Add Product
                </Link>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                {/* We'll separate the table into a client component for interactivity if needed, 
            but for now, a simple server render is fine, or a client component for actions */}
                <ProductTable products={products || []} />
            </div>
        </div>
    )
}
