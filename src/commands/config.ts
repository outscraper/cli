import { getConfig } from '../utils/config.js';
import { loadCredentials, getConfigDirectoryPath } from '../utils/credentials.js';
import { isAuthenticated } from '../utils/auth.js';

export interface ConfigureOptions {
  apiKey?: string;
  apiUrl?: string;
}

export async function configure(options: ConfigureOptions = {}): Promise<void> {
  if (!isAuthenticated() || options.apiKey || options.apiUrl) {
    const { handleLoginCommand } = await import('./login.js');
    await handleLoginCommand({ apiKey: options.apiKey, apiUrl: options.apiUrl });
    return;
  }

  await viewConfig();
  console.log('To re-authenticate, run: outscraper logout && outscraper config\n');
}

export async function viewConfig(): Promise<void> {
  const credentials = loadCredentials();
  const config = getConfig();

  console.log('\nOutscraper Configuration\n');

  if (isAuthenticated()) {
    const maskedKey = credentials?.apiKey
      ? `${credentials.apiKey.slice(0, 6)}...${credentials.apiKey.slice(-4)}`
      : 'Not set';

    console.log('Status: Authenticated');
    console.log(`API Key: ${maskedKey}`);
    console.log(`API URL: ${config.apiUrl || 'https://api.outscraper.com'}`);
    console.log(`Config:  ${getConfigDirectoryPath()}`);
    console.log(`Env Var: OUTSCRAPER_API_KEY`);
    console.log(`Stored:  ${config.apiKey ? 'yes' : 'no'}`);
  } else {
    console.log('Status: Not authenticated');
    console.log('Run `outscraper login` or `outscraper config`.');
  }

  console.log('');
}
