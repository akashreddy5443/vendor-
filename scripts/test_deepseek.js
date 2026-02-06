const { createOpenAI } = require('@ai-sdk/openai');
const { generateText } = require('ai');
require('dotenv').config({ path: '.env.local' });

async function testDeepSeek() {
    const key = process.env.DEEPSEEK_API_KEY;
    if (!key) {
        console.error('❌ Missing DEEPSEEK_API_KEY in .env.local');
        return;
    }
    console.log(`🔑 Key found: ${key.slice(0, 4)}...`);

    const deepseek = createOpenAI({
        baseURL: 'https://api.deepseek.com/v1', // Trying explicit v1
        apiKey: key,
    });

    try {
        console.log('📡 Sending request to DeepSeek (model: deepseek-chat) with /v1 base...');
        const result = await generateText({
            model: deepseek('deepseek-chat'),
            prompt: 'Hello!',
        });
        console.log('✅ Success!');
        console.log('Response:', result.text);
    } catch (error) {
        console.error('❌ Error details:');
        console.error('Name:', error.name);
        console.error('Message:', error.message);
        if (error.cause) console.error('Cause:', error.cause);
    }
}

testDeepSeek();
