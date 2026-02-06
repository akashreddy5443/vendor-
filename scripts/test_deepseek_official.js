const OpenAI = require('openai');
require('dotenv').config({ path: '.env.local' });

async function main() {
    const key = process.env.DEEPSEEK_API_KEY;
    if (!key) {
        console.error('❌ Missing Key');
        return;
    }

    console.log('Testing with official OpenAI SDK...');
    const openai = new OpenAI({
        baseURL: 'https://api.deepseek.com',
        apiKey: key
    });

    try {
        const completion = await openai.chat.completions.create({
            messages: [{ role: "user", content: "Hello" }],
            model: "deepseek-chat",
        });

        console.log('✅ Success!');
        console.log(completion.choices[0].message.content);
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

main();
