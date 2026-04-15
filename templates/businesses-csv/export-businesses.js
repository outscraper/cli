import fs from 'node:fs';
import path from 'node:path';

function loadEnv() {
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) return;

  for (const line of fs.readFileSync(envPath, 'utf-8').split(/\r?\n/)) {
    if (!line || line.startsWith('#')) continue;
    const separatorIndex = line.indexOf('=');
    if (separatorIndex === -1) continue;
    const key = line.slice(0, separatorIndex).trim();
    const value = line.slice(separatorIndex + 1).trim();
    if (key && !process.env[key]) {
      process.env[key] = value;
    }
  }
}

function toCsv(rows) {
  const headers = ['name', 'address', 'website', 'phone', 'rating', 'reviews'];
  const lines = [headers.join(',')];

  for (const row of rows) {
    const values = headers.map((header) =>
      JSON.stringify(row?.[header] ?? '')
    );
    lines.push(values.join(','));
  }

  return lines.join('\n');
}

async function main() {
  loadEnv();

  const apiKey = process.env.OUTSCRAPER_API_KEY;
  const apiUrl =
    (process.env.OUTSCRAPER_API_URL || 'https://api.outscraper.com').replace(/\/$/, '');

  if (!apiKey) {
    throw new Error('OUTSCRAPER_API_KEY is missing. Add it to .env first.');
  }

  const createResponse = await fetch(`${apiUrl}/businesses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify({
      query: 'coffee shops in San Francisco',
      limit: 25,
      fields: ['name', 'address', 'website', 'phone', 'rating', 'reviews'],
    }),
  });

  const created = await createResponse.json();
  if (!created.id) {
    throw new Error(`Unexpected response: ${JSON.stringify(created)}`);
  }

  let archive;
  while (true) {
    const archiveResponse = await fetch(`${apiUrl}/requests/${created.id}?flat=true`, {
      headers: {
        'X-API-KEY': apiKey,
      },
    });

    archive = await archiveResponse.json();
    if (!archive?.status || archive.status === 'Success') {
      break;
    }
    if (archive.status === 'Failure') {
      throw new Error(`Request ${created.id} failed.`);
    }
    await new Promise((resolve) => setTimeout(resolve, 3000));
  }

  const rows = Array.isArray(archive?.data) ? archive.data : Array.isArray(archive) ? archive : [];
  fs.writeFileSync('businesses.csv', `${toCsv(rows)}\n`, 'utf-8');
  console.log(`Saved ${rows.length} rows to businesses.csv`);
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
