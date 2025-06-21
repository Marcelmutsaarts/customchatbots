// Environment variables check voor Vercel KV
console.log("🔍 Environment Variables Check voor Vercel KV");
console.log("=".repeat(50));

const requiredEnvVars = [
  'GEMINI_API_KEY',
  'KV_REST_API_URL', 
  'KV_REST_API_TOKEN',
  'KV_URL',
  'VERCEL_URL'
];

const optionalEnvVars = [
  'NEXT_PUBLIC_BASE_URL',
  'NODE_ENV'
];

console.log("\n✅ Vereiste Environment Variables:");
requiredEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✓ ${varName}: ${value.substring(0, 10)}...`);
  } else {
    console.log(`  ❌ ${varName}: NIET INGESTELD`);
  }
});

console.log("\n🔧 Optionele Environment Variables:");
optionalEnvVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    console.log(`  ✓ ${varName}: ${value}`);
  } else {
    console.log(`  - ${varName}: niet ingesteld`);
  }
});

console.log("\n📋 Vercel KV Setup Instructies:");
console.log("1. Ga naar je Vercel dashboard");
console.log("2. Selecteer je project");
console.log("3. Ga naar Settings → Environment Variables");
console.log("4. Voeg toe:");
console.log("   - GEMINI_API_KEY: je Google AI Studio API key");
console.log("5. Ga naar Storage → Create Database → KV");
console.log("6. Connect de KV database aan je project");
console.log("7. Redeploy je applicatie");

console.log("\n🔗 Nuttige Links:");
console.log("- Vercel KV Docs: https://vercel.com/docs/storage/vercel-kv");
console.log("- Google AI Studio: https://makersuite.google.com/app/apikey");

// Test KV connectie (alleen als environment variables aanwezig zijn)
if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
  console.log("\n🧪 Testing KV Connection...");
  
  async function testKV() {
    try {
      const { kv } = await import('@vercel/kv');
      
      // Test write
      const testKey = `test:${Date.now()}`;
      await kv.set(testKey, { test: true, timestamp: new Date().toISOString() });
      console.log(`  ✓ KV Write test successful: ${testKey}`);
      
      // Test read
      const result = await kv.get(testKey);
      console.log(`  ✓ KV Read test successful:`, result);
      
      // Cleanup
      await kv.del(testKey);
      console.log(`  ✓ KV Delete test successful`);
      
    } catch (error) {
      console.log(`  ❌ KV Test failed:`, error.message);
    }
  }
  
  testKV();
} else {
  console.log("\n⚠️  KV environment variables niet gevonden - kan connectie niet testen");
} 