import { createClient } from '@/lib/supabase/server'
import { WishlistCard } from '@/components/shop/WishlistCard'
import { redirect } from 'next/navigation'
import { Star } from 'lucide-react'

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

    // Extract valid structure
    const items = wishlistItems || []

    return (
        <div className="min-h-screen bg-background py-8 md:py-16 px-4 md:px-6">
            <div className="mx-auto max-w-5xl">
                <header className="mb-8 md:mb-12">
                    <h1 className="text-2xl md:text-4xl font-black text-slate-900 font-heading uppercase tracking-tight mb-2">My Wishlist</h1>
                    <p className="text-slate-500 text-xs md:text-sm font-medium">{items.length} Saved Items</p>
                </header>

                {items.length > 0 ? (
                    <div className="flex flex-col gap-4 md:gap-6">
                        {items.map((item: any) => (
                            <WishlistCard key={item.id} item={item} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 rounded-3xl border border-dashed border-slate-200 bg-slate-50/50">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-sm mb-4">
                            <Star className="w-6 h-6 text-slate-300" />
                        </div>
                        <p className="text-xl font-black text-slate-900 mb-2">Your wishlist is empty.</p>
                        <p className="text-sm text-slate-500 mb-6">Start adding items you love!</p>
                        <a href="/products" className="inline-flex px-8 py-3 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-full hover:bg-primary transition-colors">
                            Browse Store
                        </a>
                    </div>
                )}
            </div>
        </div>
    )
}
