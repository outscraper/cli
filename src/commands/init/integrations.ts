import { confirm } from '@inquirer/prompts';
import type { InitOptions } from '../init.js';
import { handleEnvPullCommand } from '../env.js';
import { handleSetupCommand } from '../setup.js';

export async function runInitIntegrationsStep(
  options: InitOptions
): Promise<void> {
  const skipSkills = !!options.skipSkills;
  const skipEnv = !!options.skipEnv;

  if (!options.yes) {
    if (!skipSkills) {
      const installSkills = await confirm({
        message: 'Install Outscraper skills into detected agents?',
        default: true,
      });
      if (installSkills) {
        await handleSetupCommand('skills', {
          global: options.global,
          agent: options.agent,
        });
      }
    }

    if (!skipEnv) {
      const pullEnv = await confirm({
        message: 'Write OUTSCRAPER_API_KEY into a local .env file?',
        default: true,
      });
      if (pullEnv) {
        await handleEnvPullCommand({});
      }
    }

    return;
  }

  if (!skipSkills) {
    await handleSetupCommand('skills', {
      global: options.global,
      agent: options.agent,
    });
  }

  if (!skipEnv) {
    await handleEnvPullCommand({});
  }
}
