import { Navbar } from '@/components/shop/Navbar'
import { Footer } from '@/components/shop/Footer'

export default function ShopLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground transition-colors duration-300">
            <Navbar />
            <main className="flex-1 w-full max-w-[1280px] mx-auto overflow-x-hidden">
                {children}
            </main>
            <Footer />
        </div>
    )
}
