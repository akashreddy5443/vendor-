import { createClient } from '@supabase/supabase-js'

// Simple keyword mapping for "Adaptive Search"
const CATEGORY_MAP: Record<string, string> = {
    'laptop': 'Laptops',
    'laptops': 'Laptops',
    'macbook': 'Laptops',
    'computer': 'Laptops',
    'notebook': 'Laptops',
    'pc': 'Laptops',
    'phone': 'Phones',
    'phones': 'Phones',
    'mobile': 'Phones',
    'iphone': 'Phones',
    'android': 'Phones',
    'smartphone': 'Phones',
    'samsung': 'Phones',
    'pixel': 'Phones',
    'audio': 'Audio',
    'headphone': 'Audio',
    'headphones': 'Audio',
    'earphone': 'Audio',
    'earphones': 'Audio',
    'speaker': 'Audio',
    'speakers': 'Audio',
    'mic': 'Audio',
    'mics': 'Audio',
    'microphone': 'Audio',
    'headset': 'Audio',
    'keyboard': 'Accessories',
    'keyboards': 'Accessories',
    'mouse': 'Accessories',
    'mice': 'Accessories',
    'monitor': 'Accessories',
    'monitors': 'Accessories',
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

        // 1. Initialize Supabase
        const supabase = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )

        // --- INTELLIGENCE LAYER (New) ---

        // A. General Intents (Stats/Count)
        if (userQuery.includes('how many') || userQuery.includes('stock') || userQuery.includes('count')) {
            const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('status', 'active')
            return Response.json({
                role: 'assistant',
                content: `We currently have ${count} active products in our catalog, ranging from high-end laptops to essential accessories.`,
                products: []
            })
        }

        // B. FAQ Map (Hardcoded common questions)
        const FAQ_MAP: Record<string, string> = {
            'shipping': "We offer free shipping on all orders over ₹50,000. Standard delivery takes 3-5 business days.",
            'delivery': "We offer free shipping on all orders over ₹50,000. Standard delivery takes 3-5 business days.",
            'track': "You can track your order in the 'My Account' section under 'Order History'.",
            'return': "We have a 7-day return policy for defective items. Please keep the original packaging.",
            'refund': "Refunds are processed within 5-7 business days after we receive the returned item.",
            'contact': "You can reach our support team at support@techdev.com or call us at 1800-TECH-DEV.",
            'help': "I can help you find products! Try saying 'Show me gaming laptops' or 'Best phones under 50k'.",
            'who are you': "I'm TechDev AI, your personal shopping assistant. I'm connected directly to our live inventory.",
            'bot': "I'm a custom-built AI assistant designed to help you navigate our tech catalog.",
            'hello': "Hello again! specific product are you looking for today?",
            'hi': "Hi there! Ready to find some gear?",
            'yes': "Great! What specific product are you looking for? Laptops, Phones, or Audio?",
            'sure': "Awesome. Tell me what you're interested in!",
            'ok': "Okay! How can I help you today?",
            'no': "No problem. Let me know if you change your mind!",
        }

        // Check for FAQ matches
        for (const [key, answer] of Object.entries(FAQ_MAP)) {
            if (userQuery.includes(key)) {
                return Response.json({
                    role: 'assistant',
                    content: answer,
                    products: []
                })
            }
        }

        // --- END INTELLIGENCE LAYER ---

        // 2. Adaptive Parsing (Existing Logic)
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
            .eq('status', 'active')

        // Apply Filters
        if (detectedCategory) {
            query = query.eq('categories.name', detectedCategory)
        } else if (searchTerms.length > 0) {
            const term = searchTerms.join(' ')
            if (term.length > 2) {
                query = query.or(`title.ilike.%${term}%,description.ilike.%${term}%`)
            }
        } else {
            // Broadest search if no specific inputs
            query = query.limit(5)
        }

        query = query.limit(10)

        const { data: products, error } = await query

        if (error) throw error

        // 4. Construct Response with Smarter Fallback
        let responseText = ""

        if (!products || products.length === 0) {
            // Check if conversational filler
            const conversational = ['cool', 'okay', 'great', 'thanks', 'thx', 'nice']
            if (conversational.some(w => userQuery.includes(w))) {
                responseText = "You're welcome! Let me know if you need to see anything else."
            } else {
                responseText = `I couldn't find any exact matches for "${userQuery}". \n\nHowever, our technical support team is available to help! Try searching for broader categories like "Laptops" or "Phones".`
            }
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
            products: products || []
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
