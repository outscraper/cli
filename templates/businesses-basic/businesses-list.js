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

function getArgValue(flag) {
  const args = process.argv.slice(2);
  const index = args.indexOf(flag);
  if (index === -1) return undefined;
  return args[index + 1];
}

function splitCsv(value) {
  return value
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : undefined;
}

async function main() {
  loadEnv();

  const apiKey = process.env.OUTSCRAPER_API_KEY;
  const apiUrl =
    (process.env.OUTSCRAPER_API_URL || 'https://api.outscraper.cloud').replace(/\/$/, '');

  if (!apiKey) {
    throw new Error('OUTSCRAPER_API_KEY is missing. Add it to .env first.');
  }

  const positionalQuery = process.argv.slice(2).find((arg) => !arg.startsWith('--'));
  const hasStructuredFilters =
    !!getArgValue('--country') || !!getArgValue('--cities') || !!getArgValue('--types');

  const payload = {
    query: hasStructuredFilters ? undefined : getArgValue('--query') || positionalQuery,
    limit: Number(getArgValue('--limit') || 10),
    filters: {
      country_code: getArgValue('--country'),
      cities: splitCsv(getArgValue('--cities')),
      types: splitCsv(getArgValue('--types')),
      has_website: process.argv.includes('--has-website') ? true : undefined,
      has_phone: process.argv.includes('--has-phone') ? true : undefined,
    },
    fields: ['name', 'address', 'website', 'phone', 'rating', 'reviews'],
  };

  const response = await fetch(`${apiUrl}/businesses`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-KEY': apiKey,
    },
    body: JSON.stringify(payload),
  });

  const created = await response.json();
  console.log(JSON.stringify(created, null, 2));
  console.log('\nIf you get an async request id, poll /requests/{id} to retrieve the records.');
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
