import { Command } from 'commander';
import { handleStatusCommand } from '../status.js';
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

function attachStatusOptions(command: Command): Command {
  return command
    .option('-o, --output <path>', 'Write output to a file')
    .option('--json', 'Output raw JSON')
    .option('--pretty', 'Pretty print JSON output')
    .action(
      wrapAction(async (options) => {
        await handleStatusCommand(options);
      })
    );
}

export function createStatusCommand(): Command {
  return attachStatusOptions(
    new Command('status').description(
      'Show account balance and billing status via /profile/balance'
    )
  );
}

export function createBalanceCommand(): Command {
  return attachStatusOptions(
    new Command('balance').description(
      'Alias for status: show account balance and billing status'
    )
  );
}
