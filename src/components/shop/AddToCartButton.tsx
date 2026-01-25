'use client'

import { AddToCart } from './AddToCart'

interface Product {
    id: string
    title: string
    price: number
    stock: number
    product_images?: { cloudinary_url: string; is_primary: boolean }[]
}

export function AddToCartButton({ product, disabled }: { product: Product, disabled?: boolean }) {
    if (disabled) return null // Or render disabled state, but AddToCart component handles out of stock internally mostly

    const image = product.product_images?.find(i => i.is_primary)?.cloudinary_url || product.product_images?.[0]?.cloudinary_url

    return (
        <div className="w-full max-w-xs">
            <AddToCart
                productId={product.id}
                title={product.title}
                price={product.price}
                stock={product.stock}
                image={image}
            />
        </div>
    )
}
