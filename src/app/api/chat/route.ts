import { createOpenAI } from '@ai-sdk/openai'
import { generateText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

// Configure DeepSeek Provider
// Verified DeepSeek Integration
const deepseek = createOpenAI({
    baseURL: 'https://api.deepseek.com',
    apiKey: process.env.DEEPSEEK_API_KEY,
})

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()

        // CHECK FOR DEEPSEEK API KEY
        if (!process.env.DEEPSEEK_API_KEY) {
            return new Response("Missing DEEPSEEK_API_KEY in environment variables.", { status: 500 })
        }

        const result = await generateText({
            model: deepseek('deepseek-chat'),
            messages,
            system: `You are an expert AI Shopping Assistant for "TechDev Store".
            You help users find the best laptops, headphones, and tech gear.
            
            Traits:
            - Friendly, professional, and knowledgeable.
            - Concise answers (2-3 sentences max).
            - If you don't know something, ask the user to clarify.
            `
        })

        // Return the full text response
        return Response.json({ text: result.text })
    } catch (error: any) {
        console.error('Chat API error:', error)

        // Extract helpful error message
        const errorMessage = error.message || 'Unknown error occurred'
        const status = error.status || 500

        return new Response(JSON.stringify({
            error: errorMessage,
            details: error.toString()
        }), {
            status: status,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
