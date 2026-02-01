import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { WishlistToggle } from '@/components/shop/WishlistToggle'
import { AddToCartButton } from '@/components/shop/AddToCartButton'
import { ProductGallery } from '@/components/shop/ProductGallery'
import { ProductViewTracker } from '@/components/shop/ProductViewTracker'
import { SimilarProducts } from '@/components/shop/SimilarProducts'
import { ProductReviews } from '@/components/shop/ProductReviews'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params
    const supabase = await createClient()
    const { data: product } = await supabase
        .from('products')
        .select('id, title, description')
        .or(`slug.eq.${slug},id.eq.${slug}`)
        .single()

    if (!product) return { title: 'Product Not Found' }

    const { data: images } = await supabase
        .from('product_images')
        .select('cloudinary_url')
        .eq('product_id', product.id)
        .order('is_primary', { ascending: false })
        .limit(1)

    const imageUrl = images?.[0]?.cloudinary_url

    return {
        title: `${product.title} | TechDev Store`,
        description: product.description || 'Premium developer gear.',
        openGraph: {
            title: product.title,
            description: product.description || 'Premium developer gear.',
            images: imageUrl ? [{ url: imageUrl }] : [],
        },
        twitter: {
            card: 'summary_large_image',
            title: product.title,
            description: product.description || 'Premium developer gear.',
            images: imageUrl ? [imageUrl] : [],
        },
    }
}

export default async function ProductDetailPage(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params
    const supabase = await createClient()

    console.log('[PDP] Params:', params)

    // 1. Fetch Core Product
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug)

    const { data: product, error: prdError } = await supabase
        .from('products')
        .select('*')
        .eq(isUuid ? 'id' : 'slug', params.slug)
        .maybeSingle()

    if (prdError || !product) {
        console.error('[PDP] 404 - Product not found for slug:', params.slug, prdError?.message)
        notFound()
    }

    // 2. Fetch Auxiliary Data separately to avoid failure if one table is missing/broken
    const { data: { user } } = await supabase.auth.getUser()

    const [imagesRes, categoryRes, reviewsRes, purchaseRes] = await Promise.all([
        supabase.from('product_images').select('*').eq('product_id', product.id),
        product.category_id ? supabase.from('categories').select('id, name, slug').eq('id', product.category_id).maybeSingle() : Promise.resolve({ data: null }),
        supabase.from('reviews').select('*').eq('product_id', product.id).eq('status', 'approved'),
        user ? supabase.from('order_items').select('id, orders!inner(status, user_id)').eq('product_id', product.id).eq('orders.user_id', user.id).eq('orders.status', 'delivered').maybeSingle() : Promise.resolve({ data: null })
    ])

    const productImages = imagesRes.data || []
    const productCategory = categoryRes.data
    const reviewsData = reviewsRes.data || []
    const hasPurchased = !!purchaseRes.data

    // 2.5 Fetch Reviewer Details for these approved reviews
    let enrichedReviews = reviewsData
    if (reviewsData.length > 0) {
        const reviewerIds = Array.from(new Set(reviewsData.map(r => r.user_id).filter(Boolean)))
        if (reviewerIds.length > 0) {
            const { data: reviewers } = await supabase
                .from('users')
                .select('id, email, avatar_url')
                .in('id', reviewerIds)

            const usersMap = (reviewers || []).reduce((acc, u) => {
                acc[u.id] = u
                return acc
            }, {} as Record<string, any>)

            enrichedReviews = reviewsData.map(r => ({
                ...r,
                user: usersMap[r.user_id] || { email: 'Guest', avatar_url: null }
            }))
        }
    }

    console.log(`[PDP] Loaded: ${product.title} (Images: ${productImages.length}, Reviews: ${reviewsData.length}, HasPurchased: ${hasPurchased})`)


    const { title, price, description, stock } = product

    const isOutOfStock = stock === 0
    const primaryImage = productImages?.find((i: any) => i.is_primary)?.cloudinary_url || productImages?.[0]?.cloudinary_url

    // Discount Logic
    const discount = product.discount_percentage || 0
    const hasDiscount = discount > 0
    const finalPrice = hasDiscount ? price * (1 - discount / 100) : price

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
                        <ProductGallery images={productImages || []} />
                    </div>

                    {/* Product Info */}
                    <div className="space-y-8">
                        <div>
                            {productCategory && (
                                <div className="flex items-center gap-3 mb-4">
                                    <span className="text-[10px] font-black text-primary tracking-[0.3em] uppercase">
                                        Authorized {productCategory.name}
                                    </span>
                                    <div className="h-[1px] w-8 bg-primary/20" />
                                </div>
                            )}
                            <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-6 font-heading uppercase tracking-tight">{title}</h1>

                            <div className="flex items-center gap-6 mb-8 p-6 rounded-3xl bg-slate-50/50 border border-slate-100">
                                <div className="flex flex-col">
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">MSRP Retail</span>
                                    <p className="text-4xl font-black text-primary tracking-tighter">{formatPrice(price)}</p>
                                </div>
                                {stock > 0 && stock < 10 && (
                                    <div className="ml-auto">
                                        <span className="bg-red-50 text-red-600 text-[10px] font-black px-4 py-2 rounded-full border border-red-100 animate-pulse uppercase tracking-widest">
                                            Only {stock} Units Left
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Description Short */}
                        <div className="prose prose-slate max-w-none">
                            <p className="text-slate-600 leading-relaxed text-sm font-medium">
                                {description?.slice(0, 200)}...
                            </p>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-4">
                            <div className="flex items-center gap-4">
                                <div className="flex-grow">
                                    <AddToCartButton product={product} disabled={isOutOfStock} />
                                </div>
                                <WishlistToggle
                                    productId={product.id}
                                    className="p-4 rounded-full bg-white border border-slate-100 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all duration-300 shadow-lg shadow-slate-200/50"
                                />
                            </div>

                            {/* Delivery & Security Snippets */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-slate-100">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-primary/5 flex items-center justify-center text-primary shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Priority Shipping</h4>
                                        <p className="text-[11px] font-medium text-slate-500">Arrives in 2-4 business days.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-green-600 shrink-0">
                                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                                    </div>
                                    <div>
                                        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-900">Official Warranty</h4>
                                        <p className="text-[11px] font-medium text-slate-500">1-Year TechDev standard coverage.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Trust Badges */}
                    <div className="grid grid-cols-3 gap-6 py-10">
                        <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-50 shadow-sm transition-all hover:shadow-md">
                            <div className="h-10 w-10 mb-3 text-primary bg-primary/5 rounded-full flex items-center justify-center p-2.5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">100% Authentic</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-50 shadow-sm transition-all hover:shadow-md">
                            <div className="h-10 w-10 mb-3 text-primary bg-primary/5 rounded-full flex items-center justify-center p-2.5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Secure Vault</span>
                        </div>
                        <div className="flex flex-col items-center justify-center text-center p-6 bg-white rounded-3xl border border-slate-50 shadow-sm transition-all hover:shadow-md">
                            <div className="h-10 w-10 mb-3 text-primary bg-primary/5 rounded-full flex items-center justify-center p-2.5">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
                                </svg>
                            </div>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-900">Elite Support</span>
                        </div>
                    </div>

                    {/* Specifications */}
                    <div className="mt-12 pt-12 border-t border-slate-100">
                        <div className="flex items-center gap-3 mb-8">
                            <span className="text-[10px] font-black text-slate-400 tracking-[0.3em] uppercase">Technical Blueprints</span>
                            <div className="h-[1px] w-full bg-slate-100" />
                        </div>
                        <dl className="grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-12">
                            <div className="flex flex-col gap-1">
                                <dt className="text-[10px] font-black uppercase tracking-widest text-primary/60">Inventory Status</dt>
                                <dd className="text-sm font-bold text-slate-900">{isOutOfStock ? 'Depleted' : 'Operational'}</dd>
                            </div>

                            {/* Dynamic Features */}
                            {product.features && Array.isArray(product.features) && product.features.map((feature: any, index: number) => (
                                <div key={index} className="flex flex-col gap-1">
                                    <dt className="text-[10px] font-black uppercase tracking-widest text-primary/60">{feature.key}</dt>
                                    <dd className="text-sm font-bold text-slate-900">{feature.value}</dd>
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
            {productCategory && (
                <SimilarProducts
                    categoryId={productCategory.id}
                    currentProductId={product.id}
                />
            )}

            {/* Reviews Section */}
            <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                <ProductReviews
                    productId={product.id}
                    initialReviews={enrichedReviews || []}
                    hasPurchased={hasPurchased}
                    isLoggedIn={!!user}
                />
            </div>
            {/* Sticky Mobile Add To Cart Bar */}
            <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-slate-100 p-3 md:hidden shadow-[0_-5px_15px_rgba(0,0,0,0.05)] safe-area-bottom">
                <div className="flex items-center gap-4">
                    <div className="flex flex-col">
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 truncate max-w-[120px]">{product.title}</span>
                        <span className="text-lg font-black text-primary tracking-tighter">{formatPrice(hasDiscount ? finalPrice : product.price)}</span>
                    </div>
                    <div className="flex-grow">
                        <AddToCartButton product={product} disabled={isOutOfStock} className="w-full h-10 text-xs shadow-none" />
                    </div>
                </div>
            </div>
        </div>
    )
}
