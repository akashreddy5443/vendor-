import { GoogleGenerativeAI } from '@google/generative-ai'

export const maxDuration = 30

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()

        // Validate API key
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error('Missing GOOGLE_GENERATIVE_AI_API_KEY')
            return Response.json(
                { error: 'API key not configured' },
                { status: 500 }
            )
        }

        // Initialize Gemini
        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY)
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' })

        // System prompt
        const systemPrompt = `You are an expert AI Shopping Assistant for "TechDev Store".
You help users find the best laptops, headphones, and tech gear.

Traits:
- Friendly, professional, and knowledgeable
- Concise answers (2-3 sentences max)
- If you don't know something, ask the user to clarify`

        // Build conversation context
        const lastMessage = messages[messages.length - 1]
        const conversationHistory = messages.slice(0, -1)
            .map((m: any) => `${m.role === 'user' ? 'User' : 'Assistant'}: ${m.content}`)
            .join('\n')

        const fullPrompt = `${systemPrompt}

${conversationHistory ? `Previous conversation:\n${conversationHistory}\n\n` : ''}User: ${lastMessage.content}
Assistant:`

        console.log('🤖 Generating response for:', lastMessage.content)

        // Generate response
        const result = await model.generateContent(fullPrompt)
        const text = result.response.text()

        console.log('✅ Generated response:', text.substring(0, 100))

        // Return simple JSON
        return Response.json({ message: text })
    } catch (error: any) {
        console.error('❌ Chat API error:', error)
        return Response.json(
            { error: error.message || 'Failed to generate response' },
            { status: 500 }
        )
    }
}
