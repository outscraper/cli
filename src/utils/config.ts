import { loadCredentials } from './credentials.js';

export interface GlobalConfig {
  apiKey?: string;
  apiUrl?: string;
}

let globalConfig: GlobalConfig = {};

export function initializeConfig(config: Partial<GlobalConfig> = {}): void {
  const storedCredentials = loadCredentials();

  globalConfig = {
    apiKey: config.apiKey || process.env.OUTSCRAPER_API_KEY || storedCredentials?.apiKey,
    apiUrl: config.apiUrl || process.env.OUTSCRAPER_API_URL || storedCredentials?.apiUrl,
  };
}

export function getConfig(): GlobalConfig {
  return { ...globalConfig };
}

export function updateConfig(config: Partial<GlobalConfig>): void {
  globalConfig = {
    ...globalConfig,
    ...config,
  };
}

export function getApiKey(providedKey?: string): string | undefined {
  if (providedKey) return providedKey;
  if (globalConfig.apiKey) return globalConfig.apiKey;
  if (process.env.OUTSCRAPER_API_KEY) return process.env.OUTSCRAPER_API_KEY;
  return loadCredentials()?.apiKey;
}

export function resetConfig(): void {
  globalConfig = {};
}
