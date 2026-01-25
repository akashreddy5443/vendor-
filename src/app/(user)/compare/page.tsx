'use client'

import { useComparison } from '@/context/ComparisonContext'
import { createClient } from '@/lib/supabase/client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { X, ShoppingCart, Loader2 } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
import { useCart } from '@/context/CartContext'

export default function ComparePage() {
    const { selectedIds, removeFromCompare, clearCompare } = useComparison()
    const { addItem } = useCart()
    const [products, setProducts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchProducts = async () => {
            if (selectedIds.length === 0) {
                setProducts([])
                setLoading(false)
                return
            }

            setLoading(true)
            const supabase = createClient()
            const { data } = await supabase
                .from('products')
                .select('*, product_images(cloudinary_url, is_primary), category:categories(name)')
                .in('id', selectedIds)

            // Re-order to match selectedIds sequence if possible, or just use DB order
            setProducts(data || [])
            setLoading(false)
        }
        fetchProducts()
    }, [selectedIds])

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        )
    }

    if (products.length === 0) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
                <h1 className="text-3xl font-bold">Compare Products</h1>
                <p className="text-muted-foreground">No products selected for comparison.</p>
                <Link href="/products" className="bg-orange-600 hover:bg-orange-500 text-white px-6 py-3 rounded-full font-bold transition-colors">
                    Browse Products
                </Link>
            </div>
        )
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold">Product Comparison</h1>
                <button
                    onClick={clearCompare}
                    className="text-red-500 hover:text-red-400 text-sm font-medium"
                >
                    Clear All
                </button>
            </div>

            <div className="overflow-x-auto pb-4">
                <table className="w-full min-w-[800px] border-collapse">
                    <thead>
                        <tr>
                            <th className="p-4 text-left w-40 bg-zinc-50 dark:bg-zinc-900 sticky left-0 z-10 border-b border-border">Feature</th>
                            {products.map(product => (
                                <th key={product.id} className="p-4 w-60 min-w-[250px] align-top border-b border-border relative">
                                    <button
                                        onClick={() => removeFromCompare(product.id)}
                                        className="absolute top-2 right-2 text-gray-400 hover:text-red-500 p-1"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                    <div className="relative aspect-square w-full mb-4 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
                                        <Image
                                            src={product.product_images?.find((i: any) => i.is_primary)?.cloudinary_url || product.product_images?.[0]?.cloudinary_url || ''}
                                            alt={product.title}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <Link href={`/products/${product.id}`} className="hover:text-orange-600 transition-colors">
                                        <h3 className="text-lg font-bold line-clamp-2">{product.title}</h3>
                                    </Link>
                                    <div className="mt-2 text-xl font-bold text-orange-600">{formatPrice(product.price)}</div>
                                    <button
                                        onClick={() => {
                                            addItem({
                                                productId: product.id,
                                                title: product.title,
                                                price: product.price,
                                                image: product.product_images?.find((i: any) => i.is_primary)?.cloudinary_url || product.product_images?.[0]?.cloudinary_url || '',
                                                maxStock: product.stock
                                            }, 1)
                                        }}
                                        className="mt-4 w-full flex items-center justify-center gap-2 bg-zinc-900 dark:bg-zinc-100 text-white dark:text-black py-2 rounded-md font-bold hover:opacity-90 transition-opacity"
                                    >
                                        <ShoppingCart className="h-4 w-4" /> Add to Cart
                                    </button>
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        <tr>
                            <td className="p-4 font-bold bg-zinc-50 dark:bg-zinc-900 sticky left-0 z-10">Category</td>
                            {products.map(product => (
                                <td key={product.id} className="p-4">{product.category?.name || 'Uncategorized'}</td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-bold bg-zinc-50 dark:bg-zinc-900 sticky left-0 z-10">Description</td>
                            {products.map(product => (
                                <td key={product.id} className="p-4 text-sm text-muted-foreground leading-relaxed line-clamp-4 hover:line-clamp-none transition-all">
                                    {product.description}
                                </td>
                            ))}
                        </tr>
                        <tr>
                            <td className="p-4 font-bold bg-zinc-50 dark:bg-zinc-900 sticky left-0 z-10">Stock Status</td>
                            {products.map(product => (
                                <td key={product.id} className="p-4">
                                    {product.stock > 0 ? (
                                        <span className="text-green-500 font-medium">In Stock ({product.stock})</span>
                                    ) : (
                                        <span className="text-red-500 font-medium">Out of Stock</span>
                                    )}
                                </td>
                            ))}
                        </tr>
                        {/* If we had specific tech specs, we would list them here. For now this is what we have. */}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
