import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { WishlistToggle } from '@/components/shop/WishlistToggle'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { ProductViewTracker } from '@/components/shop/ProductViewTracker'
import { SimilarProducts } from '@/components/shop/SimilarProducts'

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
            categories (id, name, slug)
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
                        <AddToCartButton product={product} disabled={isOutOfStock} />
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-4 mb-8">
                        <div className="flex flex-col items-center justify-center text-center p-3 bg-gray-50 rounded-xl">
                            <div className="h-8 w-8 mb-2 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-gray-900">100% Authentic</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-3 bg-gray-50 rounded-xl">
                            <div className="h-8 w-8 mb-2 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-gray-900">Secure Payment</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-3 bg-gray-50 rounded-xl">
                            <div className="h-8 w-8 mb-2 text-blue-600">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                </svg>
                            </div>
                            <span className="text-xs font-semibold text-gray-900">Official Warranty</span>
                        </div>
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

            {/* Similar Products Section */}
            {
                categories && (
                    <SimilarProducts
                        categoryId={categories.id}
                        currentProductId={product.id}
                    />
                )
            }
        </div>
    )
}
