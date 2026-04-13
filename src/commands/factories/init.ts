import { Command } from 'commander';
import { handleInitCommand } from '../init.js';
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

export function createInitCommand(): Command {
  return new Command('init')
    .description(
      'Set up Outscraper: install CLI, authenticate, add integrations, and scaffold a template'
    )
    .argument('[template]', 'Template to scaffold (default: businesses-basic)')
    .option(
      '--all',
      'Explicitly install skills to all detected agents (default unless --agent is used)'
    )
    .option('-y, --yes', 'Run init non-interactively')
    .option('-g, --global', 'Install globally (user-level, default)')
    .option('-a, --agent <agent>', 'Install to a specific agent')
    .option('-k, --api-key <key>', 'Authenticate with this API key')
    .option('--api-url <url>', 'Persist a custom API URL')
    .option('--skip-install', 'Skip global CLI installation')
    .option('--skip-auth', 'Skip authentication')
    .option('--skip-skills', 'Skip skills installation')
    .option('--skip-mcp', 'Skip MCP installation')
    .option('--skip-env', 'Skip pulling API key into a local .env file')
    .action(
      wrapAction(async (template, options) => {
        await handleInitCommand({
          template,
          global: options.global,
          agent: options.agent,
          all: options.all,
          yes: options.yes,
          apiKey: options.apiKey,
          apiUrl: options.apiUrl,
          skipInstall: options.skipInstall,
          skipAuth: options.skipAuth,
          skipSkills: options.skipSkills,
          skipMcp: options.skipMcp,
          skipEnv: options.skipEnv,
        });
      })
    );
}