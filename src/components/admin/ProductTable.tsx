'use client'

import { deleteProduct } from '@/app/admin/products/actions'
import { formatPrice } from '@/lib/utils'
import { Edit, Trash2, Eye } from 'lucide-react'
import Link from 'next/link'

type Product = {
    id: string
    title: string
    price: number
    stock: number
    status: 'active' | 'draft'
    category_id: string
}

export function ProductTable({ products }: { products: any[] }) {
    if (products.length === 0) {
        return <div className="text-center text-gray-500 py-10">No products found.</div>
    }

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-gray-400">
                <thead className="border-b border-gray-800 text-xs uppercase text-gray-500">
                    <tr>
                        <th className="px-4 py-3">Product Name</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3">Price</th>
                        <th className="px-4 py-3">Stock</th>
                        <th className="px-4 py-3 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                    {products.map((product) => (
                        <tr key={product.id} className="hover:bg-gray-800/50">
                            <td className="px-4 py-3 font-medium text-white">{product.title}</td>
                            <td className="px-4 py-3">
                                <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ring-1 ring-inset ${product.status === 'active'
                                        ? 'bg-green-400/10 text-green-400 ring-green-400/20'
                                        : 'bg-gray-400/10 text-gray-400 ring-gray-400/20'
                                        }`}
                                >
                                    {product.status}
                                </span>
                            </td>
                            <td className="px-4 py-3 text-white">
                                {product.price ? formatPrice(product.price) : formatPrice(0)}
                            </td>
                            <td className="px-4 py-3">{product.stock}</td>
                            <td className="px-4 py-3 text-right">
                                <div className="flex justify-end gap-2">
                                    <Link
                                        href={`/admin/products/${product.id}`}
                                        className="rounded p-1 hover:bg-gray-800 hover:text-white"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </Link>
                                    <form action={async (formData) => {
                                        await deleteProduct(formData)
                                    }}>
                                        <input type="hidden" name="id" value={product.id} />
                                        <button className="rounded p-1 hover:bg-gray-800 hover:text-red-400">
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
