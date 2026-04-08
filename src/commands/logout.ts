import { deleteCredentials } from '../utils/credentials.js';
import { resetConfig } from '../utils/config.js';

export async function handleLogoutCommand(): Promise<void> {
  deleteCredentials();
  resetConfig();
  console.log('Stored credentials cleared.\n');
}
