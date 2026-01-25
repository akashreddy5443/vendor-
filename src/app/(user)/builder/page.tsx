import { createClient } from '@/lib/supabase/server'
import { BundleWizard } from '@/components/shop/BundleWizard'

export const metadata = {
    title: 'PC Builder | TechDev Store',
    description: 'Build your custom setup with our interactive wizard.',
}

export default async function BuilderPage() {
    const supabase = await createClient()

    // Fetch all active products
    const { data: products } = await supabase
        .from('products')
        .select(`
            *,
            category:categories(name),
            product_images(cloudinary_url)
        `)
        .eq('status', 'active')

    // Fetch categories
    const { data: categories } = await supabase
        .from('categories')
        .select('*')
        .order('name')

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="text-center mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-serif mb-4">
                        Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-red-600">Dream Setup</span>
                    </h1>
                    <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
                        Select your core system, add premium peripherals, and complete your battlestation.
                        Save 5% when you bundle 3 or more items.
                    </p>
                </div>

                <BundleWizard
                    products={products || []}
                    categories={categories || []}
                />
            </div>
        </div>
    )
}
