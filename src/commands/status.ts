import {
  formatProfileBalanceJson,
  formatProfileBalanceReadable,
} from '../formatters/profile.js';
import {
  getProfileBalance,
  type ProfileBalanceOptions,
} from '../services/profile.js';
import { writeOutput } from '../utils/output.js';

export type { ProfileBalanceOptions } from '../services/profile.js';

export async function handleStatusCommand(
  options: ProfileBalanceOptions = {}
): Promise<void> {
  const data = await getProfileBalance(options);

  if (options.json || options.pretty) {
    writeOutput(
      formatProfileBalanceJson(data, !!options.pretty),
      options.output,
      !!options.output
    );
    return;
  }

  writeOutput(
    formatProfileBalanceReadable(data),
    options.output,
    !!options.output
  );
}
