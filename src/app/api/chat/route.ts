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
            model: google('models/gemini-1.5-pro-latest'),
            messages,
            system: `You are an expert AI Shopping Assistant for "TechDev Store".
            You help users find the best laptops, headphones, and tech gear.
            
            Traits:
            - Friendly, professional, and knowledgeable.
            - Concise answers.
            - If you don't know something, ask the user to clarify.
            `
        })

        // Use AI SDK's built-in method which handles the streaming properly
        return result.toTextStreamResponse()
    } catch (error) {
        console.error('Chat API error:', error)
        return new Response(JSON.stringify({ error: 'Failed to process chat request' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        })
    }
}
