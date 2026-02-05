const fs = require('fs');
require('dotenv').config({ path: '.env.local' });

async function main() {
    try {
        const key = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
        if (!key) {
            console.error('❌ Missing API Key');
            return;
        }

        console.log('Fetching available models with key ending in: ' + key.slice(-4));
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${key}`);

        if (!response.ok) {
            const text = await response.text();
            console.error(`❌ Failed to list models: ${response.status} ${response.statusText}`);
            console.error(text);
            fs.writeFileSync('models.json', JSON.stringify({ error: text }, null, 2));
            return;
        }

        const data = await response.json();
        console.log(`✅ Success! Found ${data.models?.length || 0} models.`);

        fs.writeFileSync('models.json', JSON.stringify(data, null, 2));
        console.log('Wrote models to models.json');

    } catch (error) {
        console.error('❌ Script Error:', error);
        fs.writeFileSync('models.json', JSON.stringify({ error: error.toString() }, null, 2));
    }
}

main();
