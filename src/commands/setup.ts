import {
  installOutscraperMcp,
  installOutscraperSkills,
  type SetupOptions,
} from '../services/setup.js';

export type SetupSubcommand = 'skills' | 'mcp';

export async function handleSetupCommand(
  subcommand: SetupSubcommand,
  options: SetupOptions = {}
): Promise<void> {
  switch (subcommand) {
    case 'skills':
      await installOutscraperSkills(options);
      return;
    case 'mcp':
      await installOutscraperMcp(options);
      return;
    default:
      throw new Error(`Unknown setup subcommand: ${subcommand}`);
  }
}
