import { Metadata } from 'next'
import ProductsClient from './ProductsClient'

export const metadata: Metadata = {
    title: 'Shop All Products | TechDev Store',
    description: 'Explore our complete collection of premium developer gear, mechanical keyboards, desk accessories, and more.',
    openGraph: {
        title: 'Shop All Products | TechDev Store',
        description: 'Explore our complete collection of premium developer gear.',
        images: ['/og-shop.jpg'] // Replace with actual OG image or a dynamic one if available
    }
}

export default function ProductsPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    return <ProductsClient searchParams={searchParams as any} />
}
