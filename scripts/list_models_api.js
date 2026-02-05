
// Native fetch is available in Node.js 18+
require('dotenv').config({ path: '.env.local' });

async function main() {
    try {
        const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!key) {
            console.error('❌ Missing API Key');
            return;
        }

        console.log('Fetching available models...');
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);

        if (!response.ok) {
            console.error(`❌ Failed to list models: ${response.status} ${response.statusText}`);
            const text = await response.text();
            console.error(text);
            return;
        }

        const data = await response.json();
        console.log('✅ Available Models:');
        if (data.models) {
            data.models.forEach(m => {
                if (m.supportedGenerationMethods && m.supportedGenerationMethods.includes('generateContent')) {
                    console.log(`- ${m.name} (${m.displayName})`);
                }
            });
        } else {
            console.log('No models found in response:', data);
        }

    } catch (error) {
        console.error('❌ Script Error:', error);
    }
}

main();
