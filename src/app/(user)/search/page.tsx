import ProductsClient from '@/app/(user)/products/ProductsClient'

export const metadata = {
    title: 'Search | TechDev',
    description: 'Find your perfect tech gear'
}

export default async function SearchPage({ searchParams }: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const resolvedSearchParams = await searchParams

    // Normalize params to match what ProductsClient expects
    // We treat single strings as is, and ignore arrays if they happen (though usually Next.js params can be array)
    // ProductsClient expects optional strings.
    const normalize = (val: string | string[] | undefined) => Array.isArray(val) ? val[0] : val

    const propsSearchParams = {
        category: normalize(resolvedSearchParams.category),
        brand: normalize(resolvedSearchParams.brand),
        sort: normalize(resolvedSearchParams.sort),
        stock: normalize(resolvedSearchParams.stock),
        min_price: normalize(resolvedSearchParams.min_price),
        max_price: normalize(resolvedSearchParams.max_price),
        q: normalize(resolvedSearchParams.q)
    }

    // ProductsClient accepts the promise of params
    return <ProductsClient searchParams={Promise.resolve(propsSearchParams)} />
}
