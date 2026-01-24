import Link from 'next/link'
import Image from 'next/image'
import { formatPrice } from '@/lib/utils'
import { WishlistToggle } from './WishlistToggle'

interface ProductCardProps {
    product: {
        id: string
        title: string
        price: number
        slug?: string
        product_images?: { cloudinary_url: string; is_primary: boolean }[] // Supabase join shape
    }
}

export function ProductCard({ product }: ProductCardProps) {
    // Find primary image or default to first, or placeholder
    const primaryImage = product.product_images?.find(img => img.is_primary) || product.product_images?.[0]
    const imageUrl = primaryImage?.cloudinary_url

    return (
        <Link
            href={`/products/${product.id}`}
            className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card text-card-foreground transition-all duration-300 hover:scale-[1.02] hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/20"
        >
            <div className="aspect-square bg-muted relative overflow-hidden flex items-center justify-center">
                {imageUrl ? (
                    <div className="relative h-full w-full transition-transform duration-500 group-hover:scale-105">
                        <Image
                            src={imageUrl}
                            alt={product.title}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                    </div>
                ) : (
                    <span className="text-muted-foreground text-sm">No Image</span>
                )}

                {/* Quick actions or badges could go here */}
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <WishlistToggle productId={product.id} />
                </div>
            </div>

            <div className="p-4 flex flex-col flex-grow">
                <h3 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors line-clamp-2">
                    {product.title}
                </h3>
                <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-muted-foreground font-medium">{formatPrice(product.price)}</span>
                    <span className="text-xs font-bold text-primary uppercase tracking-wider opacity-0 transform translate-x-2 transition-all group-hover:opacity-100 group-hover:translate-x-0">
                        View Details
                    </span>
                </div>
            </div>
        </Link>
    )
}
