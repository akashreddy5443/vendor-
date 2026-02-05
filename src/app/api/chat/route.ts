import { google } from '@ai-sdk/google'
import { streamText } from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

export async function POST(req: Request) {
    try {
        const { messages } = await req.json()

        // CHECK FOR GOOGLE API KEY
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            return new Response("Missing GOOGLE_GENERATIVE_AI_API_KEY in environment variables.", { status: 500 })
        }

        const result = await streamText({
            model: google('gemini-1.5-flash'),
            messages,
            system: `You are an expert AI Shopping Assistant for "TechDev Store".
            You help users find the best laptops, headphones, and tech gear.
            
            Traits:
            - Friendly, professional, and knowledgeable.
            - Concise answers (2-3 sentences max).
            - If you don't know something, ask the user to clarify.
            `
        })

        // Return the text stream response
        return result.toTextStreamResponse()
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
