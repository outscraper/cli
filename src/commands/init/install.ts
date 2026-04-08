import { execSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { confirm } from '@inquirer/prompts';
import type { InitOptions } from '../init.js';

function getProjectRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
}

export async function runInitInstallStep(options: InitOptions): Promise<void> {
  if (options.skipInstall) return;

  const shouldInstall = options.yes
    ? true
    : await confirm({
        message: 'Install outscraper-cli globally?',
        default: true,
      });

  if (!shouldInstall) return;

  console.log('\nInstalling outscraper-cli globally...');

  try {
    const projectRoot = getProjectRoot();
    execSync(`npm install -g "${projectRoot}"`, { stdio: 'inherit' });
    console.log('CLI installed globally.\n');
  } catch {
    console.log(
      'Global install skipped or failed. You can still use the local project.\n'
    );
  }
}
