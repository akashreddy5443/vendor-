import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { WishlistToggle } from '@/components/shop/WishlistToggle'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { ProductViewTracker } from '@/components/shop/ProductViewTracker'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: product } = await supabase
        .from('products')
        .select('title, description')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .single()

    if (!product) return { title: 'Product Not Found' }

    return {
        title: `${product.title} | TechDev Store`,
        description: product.description || 'Premium developer gear.',
    }
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    console.log('[PDP] Params:', params)

    // Fetch Product + Images + Category
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug)

    let queryBuilder = supabase.from('products').select(`
            *,
            product_images (*),
            categories (name, slug)
        `)

    if (isUuid) {
        queryBuilder = queryBuilder.eq('id', params.slug)
    } else {
        queryBuilder = queryBuilder.eq('slug', params.slug) // Use eq for slug
    }

    const { data: product } = await queryBuilder.single()

    console.log('[PDP] Product Result:', product ? product.title : 'Not Found')

    if (!product) {
        console.error('[PDP] 404 - Product not found for slug:', params.slug)
        notFound()
    }

    const { title, price, description, stock, product_images, categories } = product
    const isOutOfStock = stock === 0
    const primaryImage = product_images?.find((i: any) => i.is_primary)?.cloudinary_url || product_images?.[0]?.cloudinary_url

    return (
        <div className="bg-background min-h-screen text-foreground">
            <ProductViewTracker
                product={{
                    id: product.id,
                    title: product.title,
                    price: product.price,
                    image: primaryImage,
                    slug: product.slug
                }}
            />
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <div className="lg:grid lg:grid-cols-2 lg:gap-x-12 xl:gap-x-16">
                    {/* Media Gallery */}
                    <div className="mb-10 lg:mb-0">
                        <ProductGallery images={product_images || []} />
                    </div>

                    {/* Product Info */}
                    <div>
                        {categories && (
                            <span className="text-sm font-medium text-blue-500 mb-2 block tracking-wider uppercase">
                                {categories.name}
                            </span>
                        )}
                        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4 font-serif">{title}</h1>

                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-end gap-4">
                                <p className="text-3xl font-bold text-primary">{formatPrice(price)}</p>
                                {stock > 0 && stock < 10 && (
                                    <span className="text-sm font-medium text-red-500 mb-1 animate-pulse">
                                        Only {stock} left!
                                    </span>
                                )}
                            </div>
                            {/* Wishlist Button - Beside Price */}
                            <div className="flex items-center">
                                <WishlistToggle
                                    productId={product.id}
                                    className="p-3 rounded-full bg-card border border-border text-foreground hover:text-red-500 hover:bg-muted transition-colors shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="mb-8 border-b border-border pb-8">
                            <AddToCartButton product={product} disabled={isOutOfStock} />
                        </div>

                        {/* Description */}
                        <div className="prose prose-invert max-w-none">
                            <h3 className="text-lg font-bold mb-3 text-foreground">Overview</h3>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                                {description || "No description available for this product."}
                            </p>
                        </div>

                        {/* Specs / Details */}
                        <div className="mt-8 pt-8 border-t border-border">
                            <h3 className="text-lg font-bold mb-4 text-foreground">Specifications</h3>
                            <dl className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
                                {/* Static Params */}
                                <div className="border-t border-border pt-4">
                                    <dt className="font-medium text-muted-foreground">Stock Status</dt>
                                    <dd className="mt-2 text-sm text-foreground">{isOutOfStock ? 'Out of Stock' : 'In Stock'}</dd>
                                </div>

                                {/* Dynamic Features */}
                                {product.features && Array.isArray(product.features) && product.features.map((feature: any, index: number) => (
                                    <div key={index} className="border-t border-border pt-4">
                                        <dt className="font-medium text-muted-foreground">{feature.key}</dt>
                                        <dd className="mt-2 text-sm text-foreground">{feature.value}</dd>
                                    </div>
                                ))}

                                {(!product.features || product.features.length === 0) && (
                                    <div className="border-t border-border pt-4">
                                        <dt className="font-medium text-muted-foreground">Other</dt>
                                        <dd className="mt-2 text-sm text-foreground">Standard Warranty</dd>
                                    </div>
                                )}
                            </dl>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
