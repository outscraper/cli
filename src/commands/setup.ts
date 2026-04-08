import {
  installOutscraperSkills,
  type SetupOptions,
} from '../services/setup.js';

export type SetupSubcommand = 'skills';

export async function handleSetupCommand(
  subcommand: SetupSubcommand,
  options: SetupOptions = {}
): Promise<void> {
  switch (subcommand) {
    case 'skills':
      await installOutscraperSkills(options);
      return;
    default:
      throw new Error(`Unknown setup subcommand: ${subcommand}`);
  }
}
