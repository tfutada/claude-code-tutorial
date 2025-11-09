#!/usr/bin/env npx tsx

import { readFileSync } from 'fs';
import { join } from 'path';

async function checkNewsAPI() {
  console.log('📡 NewsAPI Connectivity Check\n');

  // 1. Read .env.local
  let apiKey: string | undefined;
  try {
    const envPath = join(process.cwd(), '.env.local');
    const envContent = readFileSync(envPath, 'utf-8');
    const match = envContent.match(/NEWS_API_KEY=(.+)/);
    apiKey = match?.[1]?.trim();

    if (!apiKey) {
      console.log('❌ NEWS_API_KEY not found in .env.local');
      console.log('   Get your key at: https://newsapi.org/register');
      process.exit(1);
    }

    console.log('✓ Environment Check');
    console.log(`  NEWS_API_KEY: ${apiKey.substring(0, 8)}...${apiKey.substring(apiKey.length - 4)}\n`);
  } catch (error) {
    console.log('❌ Failed to read .env.local:', error);
    process.exit(1);
  }

  // 2. Test API connectivity
  console.log('🔍 Testing API Connection...');
  try {
    const url = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;
    const response = await fetch(url);

    console.log(`  Status: ${response.status} ${response.statusText}`);

    const data = await response.json();

    if (response.ok) {
      console.log('✓ API Authentication: Success');
      console.log(`  Articles returned: ${data.articles?.length || 0}`);

      if (data.articles?.[0]) {
        console.log(`  Sample headline: "${data.articles[0].title}"`);
      }

      // Check rate limit headers
      const remaining = response.headers.get('X-RateLimit-Remaining');
      const limit = response.headers.get('X-RateLimit-Limit');
      if (remaining && limit) {
        console.log(`  Rate limit: ${remaining}/${limit} requests remaining`);
      }
    } else {
      console.log('❌ API Authentication: Failed');
      console.log(`  Error: ${data.message || 'Unknown error'}`);
      console.log(`  Code: ${data.code || 'N/A'}`);
      console.log('\n  Next steps:');
      console.log('  1. Get new API key at https://newsapi.org/register');
      console.log('  2. Update NEWS_API_KEY in .env.local');
      process.exit(1);
    }
  } catch (error) {
    console.log('❌ Network Error:', error);
    process.exit(1);
  }

  console.log('\n✓ All checks passed!');
}

checkNewsAPI();