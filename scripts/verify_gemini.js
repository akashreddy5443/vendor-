
const { google } = require('@ai-sdk/google');
const { streamText } = require('ai');
require('dotenv').config({ path: '.env.local' });

async function main() {
    try {
        console.log('Checking API Key...');
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error('❌ Missing GOOGLE_GENERATIVE_AI_API_KEY');
            process.exit(1);
        }
        console.log('✅ API Key found: ' + process.env.GOOGLE_GENERATIVE_AI_API_KEY.substring(0, 5) + '...');

        console.log('Testing gemini-1.5-flash...');
        const result = await streamText({
            model: google('gemini-1.5-flash'),
            messages: [{ role: 'user', content: 'Hello' }],
        });

        console.log('✅ Stream started successfully');

        // Consume the stream somewhat to verify it works
        let fullText = '';
        for await (const chunk of result.textStream) {
            process.stdout.write(chunk);
            fullText += chunk;
        }
        console.log('\n✅ Stream finished.');

    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
