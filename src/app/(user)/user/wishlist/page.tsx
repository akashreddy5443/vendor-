import { createClient } from '@/lib/supabase/server'
import { ProductCard } from '@/components/shop/ProductCard'
import { redirect } from 'next/navigation'

export default async function WishlistPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: wishlistItems } = await supabase
        .from('wishlist')
        .select('*, product:products(*, product_images(*))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

    // Extract products from the join
    // Fix: TypesScript might complain about the shape, casting as any for speed or define proper interface
    const products = wishlistItems?.map((item: any) => item.product) || []

    return (
        <div className="min-h-screen bg-background py-16 px-6">
            <div className="mx-auto max-w-7xl">
                <h1 className="text-3xl font-bold mb-8 font-serif text-foreground">My Wishlist</h1>

                {products.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 rounded-xl border border-border bg-card">
                        <p className="text-xl font-medium text-muted-foreground">Your wishlist is empty.</p>
                        <p className="text-sm text-muted-foreground mt-2">Start adding items you love!</p>
                    </div>
                )}
            </div>
        </div>
    )
}
