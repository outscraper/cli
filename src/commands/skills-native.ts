import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

interface AgentConfig {
  name: string;
  globalSkillsDir: string;
  detectDir: string;
}

export interface NativeSkillsInstallOptions {
  agent?: string;
  global?: boolean;
}

const AGENTS: AgentConfig[] = [
  { name: 'claude-code', globalSkillsDir: '.claude/skills', detectDir: '.claude' },
  { name: 'cursor', globalSkillsDir: '.cursor/skills', detectDir: '.cursor' },
  { name: 'windsurf', globalSkillsDir: '.windsurf/skills', detectDir: '.windsurf' },
  { name: 'codex', globalSkillsDir: '.codex/skills', detectDir: '.codex' },
  { name: 'continue', globalSkillsDir: '.continue/skills', detectDir: '.continue' }
];

function getBundledSkillsDir(): string {
  return path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    '../../skills'
  );
}

function copyDir(src: string, dest: string): void {
  fs.mkdirSync(dest, { recursive: true });

  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;

    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function detectInstalledAgents(): AgentConfig[] {
  const home = os.homedir();
  return AGENTS.filter((agent) => {
    const detectPath = path.join(home, agent.detectDir);
    return fs.existsSync(detectPath);
  });
}

function detectLocalAgents(cwd: string): AgentConfig[] {
  return AGENTS.filter((agent) => {
    const detectPath = path.join(cwd, agent.detectDir);
    return fs.existsSync(detectPath);
  });
}

function resolveRequestedAgents(
  agents: AgentConfig[],
  requestedAgent?: string
): AgentConfig[] {
  if (!requestedAgent) {
    return agents;
  }

  return agents.filter((agent) => agent.name === requestedAgent);
}

function installSkillsToRoot(skillsSource: string, rootDir: string, agentName: string): void {
  fs.mkdirSync(rootDir, { recursive: true });

  for (const entry of fs.readdirSync(skillsSource, { withFileTypes: true })) {
    if (!entry.isDirectory() || entry.name.startsWith('.')) continue;

    const destination = path.join(rootDir, entry.name);
    copyDir(path.join(skillsSource, entry.name), destination);
    console.log(`Installed skills for ${agentName}: ${destination}`);
  }
}

export function hasNpx(): boolean {
  try {
    execSync('npx --version', { stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

export async function installSkillsNative(
  options: NativeSkillsInstallOptions = {}
): Promise<void> {
  const installGlobally = options.global ?? true;
  const discoveredAgents = installGlobally
    ? detectInstalledAgents()
    : detectLocalAgents(process.cwd());
  const agents = resolveRequestedAgents(discoveredAgents, options.agent);

  if (options.agent && agents.length === 0) {
    const scopeLabel = installGlobally ? 'global' : 'local';
    console.log(
      `Agent "${options.agent}" was not detected for ${scopeLabel} skills install.`
    );
    return;
  }

  if (agents.length === 0) {
    const scopeLabel = installGlobally ? 'global' : 'local';
    console.log(
      `No supported agent config directories detected for ${scopeLabel} skills install. Skipping skills install.`
    );
    return;
  }

  const skillsSource = getBundledSkillsDir();

  for (const agent of agents) {
    const agentSkillsRoot = installGlobally
      ? path.join(os.homedir(), agent.globalSkillsDir)
      : path.join(process.cwd(), agent.detectDir, 'skills');
    installSkillsToRoot(skillsSource, agentSkillsRoot, agent.name);
  }
}
