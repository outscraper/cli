import { Command } from 'commander';
import { configure, viewConfig } from '../config.js';
import { handleLoginCommand } from '../login.js';
import { handleLogoutCommand } from '../logout.js';
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

export function createConfigCommand(): Command {
  return new Command('config')
    .description('Configure Outscraper authentication')
    .option(
      '-k, --api-key <key>',
      'Provide API key directly (skips interactive flow)'
    )
    .option('--api-url <url>', 'Persist a custom API URL')
    .action(
      wrapAction(async (options) => {
        await configure({ apiKey: options.apiKey, apiUrl: options.apiUrl });
      })
    );
}

export function createViewConfigCommand(): Command {
  return new Command('view-config')
    .description('View current configuration and authentication status')
    .action(
      wrapAction(async () => {
        await viewConfig();
      })
    );
}

export function createLoginCommand(getGlobalOptions: () => {
  apiKey?: string;
  apiUrl?: string;
}): Command {
  return new Command('login')
    .description('Login to Outscraper')
    .option(
      '-k, --api-key <key>',
      'Provide API key directly (skips interactive flow)'
    )
    .option('--api-url <url>', 'Persist a custom API URL')
    .action(
      wrapAction(async (options) => {
        const globalOptions = getGlobalOptions();
        await handleLoginCommand({
          apiKey: options.apiKey ?? globalOptions.apiKey,
          apiUrl: options.apiUrl ?? globalOptions.apiUrl,
        });
      })
    );
}

export function createLogoutCommand(): Command {
  return new Command('logout')
    .description('Logout and clear stored credentials')
    .action(
      wrapAction(async () => {
        await handleLogoutCommand();
      })
    );
}
