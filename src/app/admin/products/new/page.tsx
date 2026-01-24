import { ProductForm } from '@/components/admin/ProductForm'

export default function NewProductPage() {
    return (
        <div className="mx-auto max-w-2xl space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight text-white">Add Product</h2>
                <p className="text-gray-400">Create a new product for your store.</p>
            </div>

            <div className="rounded-xl border border-gray-800 bg-gray-900 p-6">
                <ProductForm />
            </div>
        </div>
    )
}
