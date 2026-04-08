import {
  formatBusinessRows,
  formatBusinessesCsv,
  formatBusinessesJson,
  normalizeArchiveData,
} from '../formatters/businesses.js';
import {
  buildBusinessesListPayload,
  createBusinessesRequest,
  getBusiness,
  getBusinessesRequestStatus,
  hasNonEmptyBusinessPayload,
  type BusinessesListOptions,
  type BusinessGetOptions,
  type RequestCreatedResponse,
  type RequestStatusOptions,
  waitForBusinessesRequest,
} from '../services/businesses.js';
import { writeOutput } from '../utils/output.js';

export type {
  BusinessesListOptions,
  BusinessGetOptions,
  RequestStatusOptions,
} from '../services/businesses.js';

export async function handleBusinessesListCommand(
  options: BusinessesListOptions
): Promise<void> {
  const payload = buildBusinessesListPayload(options);

  if (!hasNonEmptyBusinessPayload(payload)) {
    throw new Error(
      'Provide either --query or at least one filter such as --country, --cities, --types, --name, or --os-ids.'
    );
  }

  let created: RequestCreatedResponse;

  try {
    created = await createBusinessesRequest(payload, options);
  } catch (error) {
    if (
      error instanceof Error &&
      error.message.includes('Could not parse query') &&
      options.query &&
      !payload.filters
    ) {
      throw new Error(
        `${error.message} The CLI sends --query through to the API as-is. For reliable results, use structured filters like --country, --cities, and --types. Example: outscraper businesses list --country US --cities "New York" --types "restaurant".`
      );
    }

    throw error;
  }

  if (created.id && !options.wait) {
    const summary = {
      requestId: created.id,
      status: created.status || 'Pending',
      resultsLocation: created.results_location,
      next: `outscraper businesses status ${created.id}`,
    };

    writeOutput(
      formatBusinessesJson(summary, true),
      options.output,
      !!options.output
    );
    return;
  }

  const data = created.id
    ? await waitForBusinessesRequest(created.id, options)
    : created;
  const rows = normalizeArchiveData(data);

  if (options.json || options.pretty) {
    writeOutput(
      formatBusinessesJson(data, !!options.pretty),
      options.output,
      !!options.output
    );
    return;
  }

  if (options.csv) {
    writeOutput(formatBusinessesCsv(rows), options.output, !!options.output);
    return;
  }

  writeOutput(formatBusinessRows(rows), options.output, !!options.output);
}

export async function handleBusinessGetCommand(
  businessId: string,
  options: BusinessGetOptions
): Promise<void> {
  const data = await getBusiness(businessId, options);

  writeOutput(
    formatBusinessesJson(data, true),
    options.output,
    !!options.output
  );
}

export async function handleBusinessesStatusCommand(
  requestId: string,
  options: RequestStatusOptions
): Promise<void> {
  const data = await getBusinessesRequestStatus(requestId, options);

  if (options.json || options.pretty) {
    writeOutput(
      formatBusinessesJson(data, !!options.pretty),
      options.output,
      !!options.output
    );
    return;
  }

  const rows = normalizeArchiveData(data);
  if (rows.length > 0) {
    writeOutput(formatBusinessRows(rows), options.output, !!options.output);
    return;
  }

  writeOutput(formatBusinessesJson(data, true), options.output, !!options.output);
}
