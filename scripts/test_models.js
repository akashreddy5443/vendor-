
const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function main() {
    try {
        if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
            console.error('❌ Missing GOOGLE_GENERATIVE_AI_API_KEY');
            process.exit(1);
        }

        const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY);
        // There isn't a direct listModels method on the instance in newer SDKs sometimes, 
        // but let's try the standard way or use a fetch if needed.
        // Actually, usually it's not exposed in the high level helper, but let's try to make a simple generation request 
        // to "gemini-pro" and "gemini-1.5-flash" and "gemini-2.0-flash" to see which one works.

        const modelsToTest = ['gemini-1.5-flash', 'gemini-2.0-flash', 'gemini-pro', 'gemini-1.5-pro'];

        for (const modelName of modelsToTest) {
            console.log(`\nTesting ${modelName}...`);
            try {
                const model = genAI.getGenerativeModel({ model: modelName });
                const result = await model.generateContent('Hello');
                console.log(`✅ ${modelName} WORKED! Response: ${result.response.text()}`);
            } catch (e) {
                console.log(`❌ ${modelName} failed: ${e.message.split('\n')[0]}`);
            }
        }

    } catch (error) {
        console.error('❌ Script Error:', error);
    }
}

main();
