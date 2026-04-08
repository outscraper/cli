import { getApiKey } from './config.js';
import { ensureAuthenticated } from './auth.js';

const DEFAULT_API_URL = 'https://api.outscraper.cloud';

export interface ClientOptions {
  apiKey?: string;
  apiUrl?: string;
}

export interface RequestArchiveOptions extends ClientOptions {
  flat?: boolean;
  convertFileResult?: boolean;
}

export async function resolveClientConfig(
  options: ClientOptions = {}
): Promise<{ apiKey: string; apiUrl: string }> {
  const apiKey = options.apiKey || getApiKey() || (await ensureAuthenticated());
  const apiUrl =
    options.apiUrl ||
    process.env.OUTSCRAPER_API_URL ||
    DEFAULT_API_URL;

  return {
    apiKey,
    apiUrl: apiUrl.replace(/\/$/, ''),
  };
}

export async function outscraperFetch(
  pathname: string,
  init: RequestInit = {},
  options: ClientOptions = {}
): Promise<Response> {
  const { apiKey, apiUrl } = await resolveClientConfig(options);
  const url = `${apiUrl}${pathname.startsWith('/') ? pathname : `/${pathname}`}`;

  const headers = new Headers(init.headers);
  headers.set('X-API-KEY', apiKey);

  if (init.body && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  return fetch(url, {
    ...init,
    headers,
  });
}

export async function outscraperJson<T>(
  pathname: string,
  init: RequestInit = {},
  options: ClientOptions = {}
): Promise<T> {
  const response = await outscraperFetch(pathname, init, options);
  const text = await response.text();
  const data = text ? safeJsonParse(text) : null;

  if (!response.ok) {
    const message =
      extractErrorMessage(data) || `HTTP ${response.status}: ${response.statusText}`;
    throw new Error(message);
  }

  return data as T;
}

export async function getRequestArchive(
  requestId: string,
  options: RequestArchiveOptions = {}
): Promise<any> {
  const query = new URLSearchParams();
  if (options.flat !== undefined) {
    query.set('flat', String(options.flat));
  }
  if (options.convertFileResult !== undefined) {
    query.set('convertFileResult', String(options.convertFileResult));
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return outscraperJson(`/requests/${requestId}${suffix}`, {}, options);
}

function safeJsonParse(text: string): unknown {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

function extractErrorMessage(value: unknown): string | null {
  if (!value || typeof value !== 'object') return null;

  const record = value as Record<string, unknown>;
  const message = record.errorMessage || record.message || record.error;
  return typeof message === 'string' ? message : null;
}
