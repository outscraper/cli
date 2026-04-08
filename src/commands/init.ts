import { runInitAuthStep } from './init/auth.js';
import { runInitInstallStep } from './init/install.js';
import { runInitIntegrationsStep } from './init/integrations.js';
import { runInitTemplatesStep } from './init/templates.js';

export interface InitOptions {
  template?: string;
  global?: boolean;
  agent?: string;
  all?: boolean;
  yes?: boolean;
  apiKey?: string;
  apiUrl?: string;
  skipInstall?: boolean;
  skipAuth?: boolean;
  skipSkills?: boolean;
  skipEnv?: boolean;
}

export async function handleInitCommand(options: InitOptions = {}): Promise<void> {
  console.log('\nOutscraper init\n');
  console.log(
    'This wizard helps install the CLI, save your API key, wire editor integrations, and scaffold a starter project.\n'
  );

  await runInitInstallStep(options);
  await runInitAuthStep(options);
  await runInitIntegrationsStep(options);
  await runInitTemplatesStep(options);

  console.log('Setup complete.');
  console.log('Try: outscraper setup skills');
  console.log('Or:  outscraper env\n');
}
