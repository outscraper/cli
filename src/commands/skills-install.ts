export interface SkillsInstallCommandOptions {
  agent?: string;
  all?: boolean;
  yes?: boolean;
  global?: boolean;
  includeNpxYes?: boolean;
}

export function buildSkillsInstallArgs(
  options: SkillsInstallCommandOptions = {}
): string[] {
  const args = ['npx'];

  if (options.includeNpxYes) {
    args.push('-y');
  }

  args.push('skills', 'add', 'outscraper/cli', '--full-depth');

  if (options.global ?? true) {
    args.push('--global');
  }

  const installToAllAgents = options.agent ? false : (options.all ?? true);
  if (installToAllAgents) {
    args.push('--all');
  }

  if (options.yes) {
    args.push('--yes');
  }

  if (options.agent) {
    args.push('--agent', options.agent);
  }

  return args;
}

export function cleanNpmEnv(): NodeJS.ProcessEnv {
  const env = { ...process.env };
  for (const key of Object.keys(env)) {
    if (key.startsWith('npm_') || key === 'INIT_CWD' || key === 'PROJECT_CWD') {
      delete env[key];
    }
  }
  return env;
}
