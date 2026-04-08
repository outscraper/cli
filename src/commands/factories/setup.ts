import { Command } from 'commander';
import { handleSetupCommand, type SetupSubcommand } from '../setup.js';
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

export function createSetupCommand(): Command {
  return new Command('setup')
    .description('Set up individual Outscraper integrations (skills)')
    .argument('<subcommand>', 'What to set up: "skills"')
    .option('-g, --global', 'Install globally (user-level)')
    .option('-a, --agent <agent>', 'Install to a specific agent')
    .action(
      wrapAction(async (subcommand: SetupSubcommand, options) => {
        await handleSetupCommand(subcommand, options);
      })
    );
}
