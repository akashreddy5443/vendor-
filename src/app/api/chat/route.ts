import { createClient } from '@supabase/supabase-js'

// Simple keyword mapping for "Adaptive Search"
const CATEGORY_MAP: Record<string, string> = {
    'laptop': 'Laptops',
    'macbook': 'Laptops',
    'computer': 'Laptops',
    'notebook': 'Laptops',
    'pc': 'Laptops',
    'phone': 'Phones',
    'mobile': 'Phones',
    'iphone': 'Phones',
    'android': 'Phones',
    'smartphone': 'Phones',
    'samsung': 'Phones',
    'pixel': 'Phones',
    'audio': 'Audio',
    'headphone': 'Audio',
    'earphone': 'Audio',
    'speaker': 'Audio',
    'mic': 'Audio',
    'microphone': 'Audio',
    'headset': 'Audio',
    'keyboard': 'Accessories',
    'mouse': 'Accessories',
    'monitor': 'Accessories',
    'screen': 'Accessories',
    'gaming': 'Accessories'
}

// Stopwords to clean query
const STOP_WORDS = ['i', 'want', 'buy', 'looking', 'for', 'show', 'me', 'a', 'the', 'some', 'can', 'you', 'give', 'recommend', 'need', 'is', 'are']

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()
        const lastMessage = messages[messages.length - 1]
        const userQuery = lastMessage.content.toLowerCase()

        // 1. Initialize Supabase (Anon Key is fine for public product search)
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // 2. Adaptive Parsing
        const tokens = userQuery.split(/[\s,?.!]+/).filter((t: string) => !STOP_WORDS.includes(t))

        let detectedCategory: string | null = null
        const searchTerms: string[] = []

        tokens.forEach((t: string) => {
            if (CATEGORY_MAP[t]) {
                detectedCategory = CATEGORY_MAP[t]
            } else {
                searchTerms.push(t)
            }
        })

        // 3. Build Query
        let query = supabase
            .from('products')
            .select(`
                *,
                categories!inner(name),
                product_images(cloudinary_url)
            `)
            .eq('status', 'active') // Only active products

        // Apply Filters
        if (detectedCategory) {
            // Filter by Category Relationship
            query = query.eq('categories.name', detectedCategory)
        } else if (searchTerms.length > 0) {
            // Fallback: Text Search on Title/Description
            // Using 'or' with ilike for simple fuzzy match
            const term = searchTerms.join(' ')
            if (term.length > 2) {
                query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
            }
        } else {
            // Broadest search if no specific inputs (just "show me products")
            query = query.limit(5)
        }

        query = query.limit(10) // Safety limit

        const { data: products, error } = await query

        if (error) throw error

        // 4. Construct Response
        let responseText = ""

        if (!products || products.length === 0) {
            responseText = `I couldn't find any products matching "${userQuery}". Try searching for specific items like "Laptops", "Phones", or "Headphones".`
        } else {
            const count = products.length
            if (detectedCategory) {
                responseText = `I found ${count} ${detectedCategory} for you! Here are the best options:`
            } else {
                responseText = `I found ${count} items that might interest you:`
            }
        }

        // Return structured JSON
        return Response.json({
            role: 'assistant',
            content: responseText,
            products: products || [] // Attach products for frontend to render
        })

    } catch (error: any) {
        console.error('Chat Logic Error:', error)
        return Response.json({
            role: 'assistant',
            content: "I'm having trouble connecting to the product database right now. Please try again.",
            products: []
        }, { status: 500 })
    }
}
