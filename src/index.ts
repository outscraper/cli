#!/usr/bin/env node

import { Command } from 'commander';
import packageJson from '../package.json' with { type: 'json' };
import {
  createConfigCommand,
  createLoginCommand,
  createLogoutCommand,
  createViewConfigCommand,
} from './commands/factories/auth.js';
import { createBusinessesCommand } from './commands/factories/businesses.js';
import { createEnvCommand } from './commands/factories/env.js';
import { createInitCommand } from './commands/factories/init.js';
import { createSetupCommand } from './commands/factories/setup.js';
import {
  createBalanceCommand,
  createStatusCommand,
} from './commands/factories/status.js';
import { initializeConfig } from './utils/config.js';
import { handleCliError } from './utils/errors.js';

initializeConfig();

const program = new Command();

program
  .name('outscraper')
  .description(
    'CLI for Outscraper setup, auth, business search, and templates'
  )
  .version(packageJson.version)
  .option(
    '-k, --api-key <key>',
    'Outscraper API key (or set OUTSCRAPER_API_KEY env var)'
  )
  .option(
    '--api-url <url>',
    'Outscraper API URL (or set OUTSCRAPER_API_URL env var)'
  )
  .hook('preAction', (thisCommand) => {
    const options = thisCommand.opts();
    if (options.apiKey || options.apiUrl) {
      initializeConfig({
        apiKey: options.apiKey,
        apiUrl: options.apiUrl,
      });
    }
  });

program.addCommand(createBusinessesCommand());
program.addCommand(createConfigCommand());
program.addCommand(createViewConfigCommand());
program.addCommand(
  createLoginCommand(() => {
    const options = program.opts();
    return {
      apiKey: options.apiKey,
      apiUrl: options.apiUrl,
    };
  })
);
program.addCommand(createLogoutCommand());
program.addCommand(createInitCommand());
program.addCommand(createSetupCommand());
program.addCommand(createStatusCommand());
program.addCommand(createBalanceCommand());
program.addCommand(createEnvCommand());

const args = process.argv.slice(2);

async function main(): Promise<void> {
  if (args.length === 1 && (args[0] === '-y' || args[0] === '--yes')) {
    const { handleInitCommand } = await import('./commands/init.js');
    await handleInitCommand({ yes: true });
    return;
  }

  await program.parseAsync();
}

main().catch(handleCliError);
