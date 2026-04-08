import { Command } from 'commander';
import { handleEnvPullCommand } from '../env.js';
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

export function createEnvCommand(): Command {
  return new Command('env')
    .description('Pull OUTSCRAPER_API_KEY into a local .env file')
    .option('-f, --file <path>', 'Target env file (default: .env)')
    .option('--overwrite', 'Overwrite existing OUTSCRAPER_API_KEY if present')
    .action(
      wrapAction(async (options) => {
        await handleEnvPullCommand({
          file: options.file,
          overwrite: options.overwrite,
        });
      })
    );
}
