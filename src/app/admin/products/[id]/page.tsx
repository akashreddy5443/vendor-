import { ProductForm } from '@/components/admin/ProductForm'
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'

export default async function EditProductPage({ params }: { params: { id: string } }) {
    const supabase = await createClient()

    // Fetch Product with Images
    const { data: product } = await supabase
        .from('products')
        .select(`
            *,
            product_images (cloudinary_url, media_type, is_primary)
        `)
        .eq('id', params.id)
        .single()

    if (!product) {
        notFound()
    }

    const { data: categories } = await supabase.from('categories').select('id, name')

    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Edit Product</h2>
                <p className="text-gray-400">Update product details.</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <ProductForm
                    categories={categories || []}
                    initialData={product}
                />
            </div>
        </div>
    )
}
