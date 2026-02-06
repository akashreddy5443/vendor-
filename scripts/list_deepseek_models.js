require('dotenv').config({ path: '.env.local' });

async function listModels() {
    const key = process.env.DEEPSEEK_API_KEY;
    if (!key) {
        console.error('❌ Missing Key');
        return;
    }

    const simpleUrl = 'https://api.deepseek.com/models';
    const v1Url = 'https://api.deepseek.com/v1/models';

    console.log('--- Testing /models endpoint ---');
    try {
        console.log(`Fetching ${simpleUrl}...`);
        const res = await fetch(simpleUrl, { headers: { Authorization: `Bearer ${key}` } });
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('Models:', data.data.map(m => m.id));
        } else {
            console.log('Text:', await res.text());
        }
    } catch (e) { console.error('Error:', e.message); }

    console.log('\n--- Testing /v1/models endpoint ---');
    try {
        console.log(`Fetching ${v1Url}...`);
        const res = await fetch(v1Url, { headers: { Authorization: `Bearer ${key}` } });
        console.log(`Status: ${res.status}`);
        if (res.ok) {
            const data = await res.json();
            console.log('Models:', data.data.map(m => m.id));
        } else {
            console.log('Text:', await res.text());
        }
    } catch (e) { console.error('Error:', e.message); }
}

listModels();
