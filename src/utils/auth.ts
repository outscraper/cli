import { execSync } from 'node:child_process';
import { input, select } from '@inquirer/prompts';
import { getApiKey, updateConfig } from './config.js';
import { saveCredentials } from './credentials.js';

const API_KEYS_URL = 'https://app.outscraper.com/account/api';

export function isAuthenticated(): boolean {
  return !!getApiKey();
}

export function openApiKeysPage(): void {
  try {
    switch (process.platform) {
      case 'win32':
        execSync(`start "" "${API_KEYS_URL}"`, { stdio: 'ignore', shell: 'cmd.exe' });
        break;
      case 'darwin':
        execSync(`open "${API_KEYS_URL}"`, { stdio: 'ignore' });
        break;
      default:
        execSync(`xdg-open "${API_KEYS_URL}"`, { stdio: 'ignore' });
        break;
    }
    console.log(`Opened: ${API_KEYS_URL}`);
  } catch {
    console.log(`Open your Outscraper account here to get an API key: ${API_KEYS_URL}`);
  }
}

export async function promptForApiKey(
  options: { promptFirst?: boolean } = {}
): Promise<string> {
  if (options.promptFirst ?? true) {
    const method = await select({
      message: 'How would you like to continue?',
      choices: [
        {
          name: 'Open your Outscraper account and get an API key',
          value: 'open-account',
        },
        {
          name: 'Enter API key manually',
          value: 'manual',
        },
      ],
    });

    if (method === 'open-account') {
      openApiKeysPage();
    }
  }

  return input({
    message: 'Enter your Outscraper API key',
    validate(value) {
      return value.trim().length > 0 || 'API key is required';
    },
  });
}

export async function ensureAuthenticated(): Promise<string> {
  const existing = getApiKey();
  if (existing) return existing;

  const apiKey = await promptForApiKey();

  saveCredentials({ apiKey });
  updateConfig({ apiKey });
  return apiKey;
}
