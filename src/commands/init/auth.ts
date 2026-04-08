import { select } from '@inquirer/prompts';
import { saveCredentials } from '../../utils/credentials.js';
import { updateConfig } from '../../utils/config.js';
import {
  isAuthenticated,
  openApiKeysPage,
  promptForApiKey,
} from '../../utils/auth.js';
import type { InitOptions } from '../init.js';

export async function runInitAuthStep(options: InitOptions): Promise<void> {
  if (options.skipAuth) return;
  if (isAuthenticated() && !options.apiKey) {
    console.log('Already authenticated.\n');
    return;
  }

  let apiKey = options.apiKey;

  if (!apiKey && !options.yes) {
    const method = await select({
      message: 'How would you like to authenticate?',
      choices: [
        {
          name: 'Open your Outscraper account and get an API key',
          value: 'open-account',
        },
        { name: 'Enter API key manually', value: 'manual' },
        { name: 'Skip for now', value: 'skip' },
      ],
    });

    if (method === 'skip') {
      console.log('Skipped authentication. Run `outscraper login` later.\n');
      return;
    }

    if (method === 'open-account') {
      openApiKeysPage();
      apiKey = await promptForApiKey({ promptFirst: false });
    } else if (method === 'manual') {
      apiKey = await promptForApiKey({ promptFirst: false });
    }
  } else if (!apiKey) {
    apiKey = await promptForApiKey();
  }

  saveCredentials({ apiKey, apiUrl: options.apiUrl });
  updateConfig({ apiKey, apiUrl: options.apiUrl });
  console.log('Authentication saved.\n');
}
