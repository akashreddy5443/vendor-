// Quick script to verify Vercel deployment status
// Run this to check if the latest code is deployed

const https = require('https');

const VERCEL_API_URL = 'https://api.vercel.com/v6/deployments';

console.log('🔍 Checking Vercel deployment status...\n');

// Check if we can access the production site
const productionUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://vendor-.vercel.app';

console.log(`Checking production site: ${productionUrl}`);
console.log('\n📋 Manual Steps to Verify:');
console.log('1. Go to https://vercel.com/dashboard');
console.log('2. Find your "vendor-" project');
console.log('3. Check the "Deployments" tab');
console.log('4. Verify the latest deployment shows:');
console.log('   - Commit: "fix: remove opacity from announcement bar text for better readability"');
console.log('   - Status: "Ready" (green checkmark)');
console.log('   - Time: Within last few hours');
console.log('\n⚠️  If deployment is stuck or failed:');
console.log('   - Click "Redeploy" button');
console.log('   - Or push a new commit to trigger rebuild');
console.log('\n💡 Quick test:');
console.log('   - Visit your site and open DevTools Console');
console.log('   - Type: fetch("/api/admin/homepage/catalog-menu", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({test: true})})');
console.log('   - If you get 404, the new API route is not deployed yet');
