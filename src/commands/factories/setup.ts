import { Command } from 'commander';
import { handleSetupCommand, type SetupSubcommand } from '../setup.js';
import { handleCliError } from '../../utils/errors.js';
import {
  SUPPORTED_SKILLS_AGENTS,
  formatSupportedAgents,
} from '../../utils/agents.js';

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
  const supportedSkillsAgentsLabel = formatSupportedAgents(SUPPORTED_SKILLS_AGENTS);

  return new Command('setup')
    .description('Set up individual Outscraper integrations (skills, mcp)')
    .argument('<subcommand>', 'What to set up: "skills" or "mcp"')
    .option('-g, --global', 'Install globally (user-level)')
    .option('-a, --agent <agent>', 'Install to a specific agent')
    .addHelpText(
      'after',
      `\nSupported agents:\n  skills: ${supportedSkillsAgentsLabel}\n  mcp: any agent supported by add-mcp (run "npx add-mcp list-agents" to see all)\n`
    )
    .hook('preAction', (command) => {
      const options = command.opts<{ agent?: string }>();
      const subcommand = command.processedArgs[0] as SetupSubcommand | undefined;

      if (!options.agent) {
        return;
      }

      if (
        subcommand === 'skills' &&
        !SUPPORTED_SKILLS_AGENTS.includes(options.agent as never)
      ) {
        throw new Error(
          `Unsupported skills agent "${options.agent}". Supported skills agents: ${supportedSkillsAgentsLabel}.`
        );
      }
    })
    .action(
      wrapAction(async (subcommand: SetupSubcommand, options) => {
        await handleSetupCommand(subcommand, options);
      })
    );
}