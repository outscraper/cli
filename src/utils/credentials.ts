import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

export interface StoredCredentials {
  apiKey?: string;
  apiUrl?: string;
}

function getConfigDir(): string {
  const homeDir = os.homedir();
  const platform = os.platform();

  switch (platform) {
    case 'darwin':
      return path.join(homeDir, 'Library', 'Application Support', 'outscraper-cli');
    case 'win32':
      return path.join(homeDir, 'AppData', 'Roaming', 'outscraper-cli');
    default:
      return path.join(homeDir, '.config', 'outscraper-cli');
  }
}

function getCredentialsPath(): string {
  return path.join(getConfigDir(), 'credentials.json');
}

function ensureConfigDir(): void {
  const configDir = getConfigDir();
  if (!fs.existsSync(configDir)) {
    fs.mkdirSync(configDir, { recursive: true, mode: 0o700 });
  }
}

export function loadCredentials(): StoredCredentials | null {
  try {
    const credentialsPath = getCredentialsPath();
    if (!fs.existsSync(credentialsPath)) {
      return null;
    }

    return JSON.parse(fs.readFileSync(credentialsPath, 'utf-8')) as StoredCredentials;
  } catch {
    return null;
  }
}

export function saveCredentials(credentials: StoredCredentials): void {
  ensureConfigDir();
  const credentialsPath = getCredentialsPath();
  const existing = loadCredentials();
  const merged = { ...existing, ...credentials };
  fs.writeFileSync(credentialsPath, JSON.stringify(merged, null, 2), 'utf-8');
}

export function deleteCredentials(): void {
  const credentialsPath = getCredentialsPath();
  if (fs.existsSync(credentialsPath)) {
    fs.unlinkSync(credentialsPath);
  }
}

export function getConfigDirectoryPath(): string {
  return getConfigDir();
}
