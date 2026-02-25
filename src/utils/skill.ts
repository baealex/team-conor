export interface SkillMeta {
  name: string;
  description: string;
  trigger: string;
  body: string;
}

export function parseSkillTemplate(content: string): SkillMeta {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) {
    throw new Error('Skill template must have YAML frontmatter');
  }

  const fields: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim().replace(/^["']|["']$/g, '');
    fields[key] = value;
  }

  if (!fields.name) {
    throw new Error('Skill template must have a "name" field in frontmatter');
  }

  const body = content.replace(/^---[\s\S]*?---\n*/, '');

  return {
    name: fields.name,
    description: fields.description || '',
    trigger: fields.trigger || '',
    body: body.trim(),
  };
}

export function toClaudeCommand(skill: SkillMeta): { path: string; content: string } {
  return {
    path: `.claude/commands/${skill.name}.md`,
    content: skill.body + '\n',
  };
}

export function toCodexSkill(skill: SkillMeta): { path: string; content: string } {
  const lines: string[] = [];
  lines.push(`# ${skill.name}`);
  if (skill.description) {
    lines.push(`${skill.description}`);
  }
  lines.push('');
  lines.push(skill.body);
  lines.push('');

  return {
    path: `.agents/skills/${skill.name}/SKILL.md`,
    content: lines.join('\n'),
  };
}
