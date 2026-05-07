import fs from 'fs';
import https from 'https';

// Read API key from .env manually
const envPath = new URL('.env', import.meta.url);
let apiKey = '';
try {
  const envContent = fs.readFileSync(envPath, 'utf8');
  const match = envContent.match(/VITE_GEMINI_API_KEY="([^"]+)"/);
  if (match) apiKey = match[1];
} catch (e) {
  console.log('Error reading .env');
}

if (!apiKey) {
  console.log('No API key found in .env');
  process.exit(1);
}

// Fetch list of models
const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`;

https.get(url, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      if (json.error) {
        console.log('API Error:', json.error.message);
      } else {
        const models = json.models.map(m => m.name);
        console.log('Available Models:', models.join(', '));
      }
    } catch (e) {
      console.log('Error parsing response:', data);
    }
  });
}).on('error', err => {
  console.log('Request error:', err.message);
});



