export const SUPPORTED_SKILLS_AGENTS = [
  'claude-code',
  'cursor',
  'windsurf',
  'codex',
  'continue',
] as const;

export type SupportedSkillsAgent = (typeof SUPPORTED_SKILLS_AGENTS)[number];

export function formatSupportedAgents(
  agents: readonly string[],
  conjunction = 'or'
): string {
  if (agents.length === 0) {
    return '';
  }

  if (agents.length === 1) {
    return agents[0];
  }

  if (agents.length === 2) {
    return `${agents[0]} ${conjunction} ${agents[1]}`;
  }

  return `${agents.slice(0, -1).join(', ')}, ${conjunction} ${agents.at(-1)}`;
}