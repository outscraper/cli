import fs from 'node:fs';
import { getRequestArchive, outscraperJson, type ClientOptions } from '../utils/client.js';

export interface BusinessesListOptions extends ClientOptions {
  query?: string;
  limit?: number;
  cursor?: string;
  includeTotal?: boolean;
  fields?: string;
  country?: string;
  states?: string;
  cities?: string;
  counties?: string;
  postalCodes?: string;
  name?: string;
  excludeName?: boolean;
  types?: string;
  ignoreTypes?: string;
  rating?: string;
  reviews?: string;
  hasWebsite?: boolean;
  domain?: string;
  hasPhone?: boolean;
  phone?: string;
  businessStatuses?: string;
  areaService?: boolean;
  verified?: boolean;
  attributes?: string;
  locatedOsId?: string;
  broadMatch?: boolean;
  businessOnly?: boolean;
  osIds?: string;
  filtersFile?: string;
  output?: string;
  json?: boolean;
  pretty?: boolean;
  csv?: boolean;
  wait?: boolean;
  pollInterval?: number;
  timeout?: number;
  flat?: boolean;
}

export interface BusinessGetOptions extends ClientOptions {
  fields?: string;
  output?: string;
  json?: boolean;
  pretty?: boolean;
}

export interface RequestStatusOptions extends ClientOptions {
  output?: string;
  json?: boolean;
  pretty?: boolean;
  flat?: boolean;
  convertFileResult?: boolean;
}

export interface RequestCreatedResponse {
  id?: string;
  status?: string;
  results_location?: string;
  [key: string]: unknown;
}

function parseCsvList(value?: string): string[] | undefined {
  if (!value) return undefined;
  const items = value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
  return items.length > 0 ? items : undefined;
}

function maybeAssign<T>(
  target: Record<string, unknown>,
  key: string,
  value: T | undefined
): void {
  if (value !== undefined) {
    target[key] = value;
  }
}

function getExplicitBooleanOption(
  options: BusinessesListOptions,
  key: keyof BusinessesListOptions
): boolean | undefined {
  if (Object.prototype.hasOwnProperty.call(options, key)) {
    const value = options[key];
    return typeof value === 'boolean' ? value : undefined;
  }
  return undefined;
}

function loadJsonFile(filePath: string): Record<string, unknown> {
  try {
    return JSON.parse(fs.readFileSync(filePath, 'utf-8')) as Record<string, unknown>;
  } catch (error) {
    throw new Error(
      `Failed to read JSON file ${filePath}: ${
        error instanceof Error ? error.message : 'Unknown error'
      }`
    );
  }
}

export function buildBusinessFilters(
  options: BusinessesListOptions
): Record<string, unknown> {
  const filters = options.filtersFile ? loadJsonFile(options.filtersFile) : {};

  maybeAssign(filters, 'os_ids', parseCsvList(options.osIds));
  maybeAssign(filters, 'country_code', options.country);
  maybeAssign(filters, 'states', parseCsvList(options.states));
  maybeAssign(filters, 'cities', parseCsvList(options.cities));
  maybeAssign(filters, 'counties', parseCsvList(options.counties));
  maybeAssign(filters, 'postal_codes', parseCsvList(options.postalCodes));
  maybeAssign(filters, 'name', options.name);
  maybeAssign(
    filters,
    'name_exclude',
    getExplicitBooleanOption(options, 'excludeName')
  );
  maybeAssign(filters, 'types', parseCsvList(options.types));
  maybeAssign(filters, 'ignore_types', parseCsvList(options.ignoreTypes));
  maybeAssign(filters, 'rating', options.rating);
  maybeAssign(filters, 'reviews', options.reviews);
  maybeAssign(
    filters,
    'has_website',
    getExplicitBooleanOption(options, 'hasWebsite')
  );
  maybeAssign(filters, 'domain', options.domain);
  maybeAssign(
    filters,
    'has_phone',
    getExplicitBooleanOption(options, 'hasPhone')
  );
  maybeAssign(filters, 'phone', options.phone);
  maybeAssign(
    filters,
    'business_statuses',
    parseCsvList(options.businessStatuses)
  );
  maybeAssign(
    filters,
    'area_service',
    getExplicitBooleanOption(options, 'areaService')
  );
  maybeAssign(filters, 'verified', getExplicitBooleanOption(options, 'verified'));
  maybeAssign(filters, 'attributes', parseCsvList(options.attributes));
  maybeAssign(filters, 'located_os_id', options.locatedOsId);
  maybeAssign(
    filters,
    'broad_match',
    getExplicitBooleanOption(options, 'broadMatch')
  );
  maybeAssign(
    filters,
    'business_only',
    getExplicitBooleanOption(options, 'businessOnly')
  );

  return filters;
}

export function buildBusinessesListPayload(
  options: BusinessesListOptions
): Record<string, unknown> {
  const payload: Record<string, unknown> = {};
  const filters = buildBusinessFilters(options);

  if (Object.keys(filters).length > 0) {
    payload.filters = filters;
  }

  maybeAssign(payload, 'query', options.query);
  maybeAssign(payload, 'limit', options.limit);
  maybeAssign(payload, 'cursor', options.cursor);
  maybeAssign(payload, 'include_total', options.includeTotal);

  const fields = parseCsvList(options.fields);
  if (fields) {
    payload.fields = fields;
  }

  return payload;
}

export function hasNonEmptyBusinessPayload(
  payload: Record<string, unknown>
): boolean {
  const hasQuery =
    typeof payload.query === 'string' && payload.query.trim().length > 0;
  const filters =
    payload.filters && typeof payload.filters === 'object'
      ? (payload.filters as Record<string, unknown>)
      : null;
  const hasFilters = !!filters && Object.keys(filters).length > 0;
  return hasQuery || hasFilters;
}

export async function waitForBusinessesRequest(
  requestId: string,
  options: BusinessesListOptions
): Promise<any> {
  const pollIntervalMs = (options.pollInterval ?? 3) * 1000;
  const timeoutMs = options.timeout ? options.timeout * 1000 : undefined;
  const startedAt = Date.now();

  while (true) {
    const result = await getRequestArchive(requestId, {
      apiKey: options.apiKey,
      apiUrl: options.apiUrl,
      flat: options.flat ?? true,
    });

    const status = typeof result?.status === 'string' ? result.status : undefined;
    if (!status || status === 'Success') {
      return result;
    }

    if (status === 'Failure') {
      throw new Error(`Outscraper request ${requestId} failed.`);
    }

    process.stderr.write(`Waiting for request ${requestId} (${status})...\n`);

    if (timeoutMs && Date.now() - startedAt > timeoutMs) {
      throw new Error(`Timed out waiting for request ${requestId}.`);
    }

    await new Promise((resolve) => setTimeout(resolve, pollIntervalMs));
  }
}

export async function createBusinessesRequest(
  payload: Record<string, unknown>,
  options: BusinessesListOptions
): Promise<RequestCreatedResponse> {
  return outscraperJson<RequestCreatedResponse>(
    '/businesses',
    {
      method: 'POST',
      body: JSON.stringify(payload),
    },
    options
  );
}

export async function getBusiness(
  businessId: string,
  options: BusinessGetOptions
): Promise<any> {
  const query = new URLSearchParams();
  if (options.fields) {
    query.set('fields', options.fields);
  }

  const suffix = query.toString() ? `?${query.toString()}` : '';
  return outscraperJson(
    `/businesses/${encodeURIComponent(businessId)}${suffix}`,
    {},
    options
  );
}

export async function getBusinessesRequestStatus(
  requestId: string,
  options: RequestStatusOptions
): Promise<any> {
  return getRequestArchive(requestId, {
    apiKey: options.apiKey,
    apiUrl: options.apiUrl,
    flat: options.flat ?? true,
    convertFileResult: options.convertFileResult,
  });
}
