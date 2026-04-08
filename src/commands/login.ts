import { saveCredentials, getConfigDirectoryPath } from '../utils/credentials.js';
import { updateConfig } from '../utils/config.js';
import { isAuthenticated, promptForApiKey } from '../utils/auth.js';

export interface LoginOptions {
  apiKey?: string;
  apiUrl?: string;
}

export async function handleLoginCommand(
  options: LoginOptions = {}
): Promise<void> {
  if (isAuthenticated() && !options.apiKey && !options.apiUrl) {
    console.log('You are already logged in.');
    console.log(`Credentials stored at: ${getConfigDirectoryPath()}\n`);
    return;
  }

  const apiKey =
    options.apiKey || (await promptForApiKey());

  saveCredentials({ apiKey, apiUrl: options.apiUrl });
  updateConfig({ apiKey, apiUrl: options.apiUrl });

  console.log('Login successful.\n');
}
