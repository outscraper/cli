import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { buildSkillsInstallArgs } from '../commands/skills-install.js';
import { hasNpx, installSkillsNative } from '../commands/skills-native.js';

export interface SetupOptions {
  global?: boolean;
  agent?: string;
}

function getProjectRoot(): string {
  return path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
}

function isLocalDevEnvironment(): boolean {
  const projectRoot = getProjectRoot();
  const srcDir = path.join(projectRoot, 'src');
  const skillsDir = path.join(projectRoot, 'skills');
  const packageJsonPath = path.join(projectRoot, 'package.json');

  return (
    fs.existsSync(srcDir) &&
    fs.existsSync(skillsDir) &&
    fs.existsSync(packageJsonPath) &&
    process.env.OUTSCRAPER_USE_REMOTE_SKILLS !== '1'
  );
}

export function shouldPreferNativeSkillsInstall(): boolean {
  return isLocalDevEnvironment();
}

export async function installOutscraperSkills(
  options: SetupOptions = {}
): Promise<void> {
  if (shouldPreferNativeSkillsInstall()) {
    console.log('Using bundled local skills install for this dev build.\n');
    await installSkillsNative(options);
    return;
  }

  if (hasNpx()) {
    const args = buildSkillsInstallArgs({
      agent: options.agent,
      global: options.global,
      includeNpxYes: true,
    });

    const command = args.join(' ');
    console.log(`Running: ${command}\n`);

    try {
      execSync(command, { stdio: 'inherit' });
      return;
    } catch {
      console.log('Falling back to native skill install.\n');
    }
  }

  await installSkillsNative(options);
}
