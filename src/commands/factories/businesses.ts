import { Command } from 'commander';
import {
  handleBusinessGetCommand,
  handleBusinessesListCommand,
  handleBusinessesStatusCommand,
} from '../businesses.js';
import { handleCliError } from '../../utils/errors.js';

function wrapAction<TArgs extends unknown[]>(
  handler: (...args: TArgs) => Promise<void> | void
) {
  return async (...args: TArgs): Promise<void> => {
    try {
      await handler(...args);
    } catch (error) {
      handleCliError(error);
    }
  };
}

export function createBusinessesCommand(): Command {
  const businessesCommand = new Command('businesses').description(
    'Query Outscraper business records'
  );

  businessesCommand
    .command('list')
    .description('List business records with filters')
    .option('-q, --query <query>', 'Natural language query')
    .option('--limit <number>', 'Maximum number of records to return', parseInt)
    .option('--cursor <cursor>', 'Cursor for pagination')
    .option('--include-total', 'Include total matching records')
    .option('--fields <fields>', 'Comma-separated fields to include')
    .option('--country <code>', 'Two-letter country code')
    .option('--states <states>', 'Comma-separated states or provinces')
    .option('--cities <cities>', 'Comma-separated cities')
    .option('--counties <counties>', 'Comma-separated counties')
    .option('--postal-codes <codes>', 'Comma-separated postal codes')
    .option('--name <name>', 'Business name filter')
    .option('--exclude-name', 'Exclude businesses matching --name')
    .option('--types <types>', 'Comma-separated business categories')
    .option('--ignore-types <types>', 'Comma-separated categories to exclude')
    .option('--rating <filter>', 'Rating filter expression, for example 4.5+')
    .option('--reviews <filter>', 'Reviews filter expression, for example 100+')
    .option('--has-website', 'Only include businesses with a website')
    .option('--domain <domain>', 'Filter by website domain')
    .option('--has-phone', 'Only include businesses with a phone number')
    .option('--phone <phone>', 'Phone filter')
    .option(
      '--business-statuses <statuses>',
      'Comma-separated statuses: operational,closed_temporarily,closed_permanently'
    )
    .option('--area-service', 'Filter by area service businesses')
    .option('--verified', 'Only include verified businesses')
    .option('--attributes <attributes>', 'Comma-separated business attributes')
    .option('--located-os-id <id>', 'Location reference Outscraper ID')
    .option(
      '--broad-match',
      'Use broader matching for text and category filters'
    )
    .option('--business-only', 'Return only businesses')
    .option('--os-ids <ids>', 'Comma-separated Outscraper business IDs')
    .option('--filters-file <path>', 'JSON file with filters object to merge in')
    .option('--wait', 'Poll until async request is completed')
    .option(
      '--poll-interval <seconds>',
      'Polling interval when using --wait',
      parseFloat
    )
    .option(
      '--timeout <seconds>',
      'Polling timeout when using --wait',
      parseFloat
    )
    .option('--flat', 'Request flattened archive results when polling')
    .option('--csv', 'Output CSV')
    .option('-o, --output <path>', 'Write output to a file')
    .option('--json', 'Output raw JSON')
    .option('--pretty', 'Pretty print JSON output')
    .action(
      wrapAction(async (options) => {
        await handleBusinessesListCommand(options);
      })
    );

  businessesCommand
    .command('get <businessId>')
    .description('Get a business by os_id, place_id, or google_id')
    .option('--fields <fields>', 'Comma-separated fields to include')
    .option('-o, --output <path>', 'Write output to a file')
    .option('--json', 'Output raw JSON')
    .option('--pretty', 'Pretty print JSON output')
    .action(
      wrapAction(async (businessId, options) => {
        await handleBusinessGetCommand(businessId, options);
      })
    );

  businessesCommand
    .command('status <requestId>')
    .description('Fetch results for an async Outscraper request ID')
    .option('--flat', 'Return flat results')
    .option(
      '--convert-file-result',
      'Convert file-based results into JSON when supported'
    )
    .option('-o, --output <path>', 'Write output to a file')
    .option('--json', 'Output raw JSON')
    .option('--pretty', 'Pretty print JSON output')
    .action(
      wrapAction(async (requestId, options) => {
        await handleBusinessesStatusCommand(requestId, options);
      })
    );

  return businessesCommand;
}
