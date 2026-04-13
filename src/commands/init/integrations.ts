import { confirm } from '@inquirer/prompts';
import type { InitOptions } from '../init.js';
import { handleEnvPullCommand } from '../env.js';
import { handleSetupCommand } from '../setup.js';

export async function runInitIntegrationsStep(
  options: InitOptions
): Promise<void> {
  const skipSkills = !!options.skipSkills;
  const skipMcp = !!options.skipMcp;
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

    if (!skipMcp) {
      const installMcp = await confirm({
        message: 'Install the Outscraper MCP server into your editor/agent?',
        default: true,
      });
      if (installMcp) {
        await handleSetupCommand('mcp', {
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

  if (!skipMcp) {
    await handleSetupCommand('mcp', {
      global: options.global,
      agent: options.agent,
    });
  }

  if (!skipEnv) {
    await handleEnvPullCommand({});
  }
}