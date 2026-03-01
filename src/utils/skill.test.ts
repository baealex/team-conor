import { describe, it, expect } from 'vitest';
import { parseSkillTemplate, toClaudeCommand, toCodexSkill, SkillMeta } from './skill.js';

const SAMPLE_TEMPLATE = `---
name: conor-review
description: "팀 페르소나 기반 코드 리뷰를 실행합니다"
trigger: "사용자가 코드 리뷰를 요청하면"
---
팀 페르소나 기반 코드 리뷰를 실행합니다.

절차:
1. 리뷰 대상 코드/변경사항을 파악한다
2. 결과를 통합하여 사용자에게 제시
`;

const MINIMAL_TEMPLATE = `---
name: conor-minimal
---
본문만 있는 스킬입니다.
`;

describe('parseSkillTemplate', () => {
  it('frontmatter에서 name, description, trigger를 파싱한다', () => {
    const result = parseSkillTemplate(SAMPLE_TEMPLATE);

    expect(result.name).toBe('conor-review');
    expect(result.description).toBe('팀 페르소나 기반 코드 리뷰를 실행합니다');
    expect(result.trigger).toBe('사용자가 코드 리뷰를 요청하면');
  });

  it('frontmatter 이후의 본문을 body로 파싱한다', () => {
    const result = parseSkillTemplate(SAMPLE_TEMPLATE);

    expect(result.body).toContain('절차:');
    expect(result.body).toContain('리뷰 대상 코드/변경사항을 파악한다');
  });

  it('body에 frontmatter가 포함되지 않는다', () => {
    const result = parseSkillTemplate(SAMPLE_TEMPLATE);

    expect(result.body).not.toContain('---');
    expect(result.body).not.toContain('name:');
    expect(result.body).not.toContain('trigger:');
  });

  it('description과 trigger가 없으면 빈 문자열로 처리한다', () => {
    const result = parseSkillTemplate(MINIMAL_TEMPLATE);

    expect(result.name).toBe('conor-minimal');
    expect(result.description).toBe('');
    expect(result.trigger).toBe('');
  });

  it('frontmatter가 없으면 에러를 던진다', () => {
    expect(() => parseSkillTemplate('# 제목\n본문')).toThrow('YAML frontmatter');
  });

  it('name이 없으면 에러를 던진다', () => {
    expect(() => parseSkillTemplate('---\ndescription: "test"\n---\n본문')).toThrow('"name" field');
  });
});

describe('toClaudeCommand', () => {
  const skill: SkillMeta = {
    name: 'conor-review',
    description: '팀 페르소나 기반 코드 리뷰를 실행합니다',
    trigger: '사용자가 코드 리뷰를 요청하면',
    body: '팀 페르소나 기반 코드 리뷰를 실행합니다.\n\n절차:\n1. 리뷰한다',
  };

  it('.claude/commands/ 경로를 생성한다', () => {
    const result = toClaudeCommand(skill);
    expect(result.path).toBe('.claude/commands/conor-review.md');
  });

  it('body만 content로 출력한다', () => {
    const result = toClaudeCommand(skill);
    expect(result.content).toBe(skill.body + '\n');
  });

  it('content에 heading이나 description을 포함하지 않는다', () => {
    const result = toClaudeCommand(skill);
    expect(result.content).not.toContain('# conor-review');
    expect(result.content).not.toMatch(/^팀 페르소나.*\n팀 페르소나/);
  });
});

describe('toCodexSkill', () => {
  const skill: SkillMeta = {
    name: 'conor-review',
    description: '팀 페르소나 기반 코드 리뷰를 실행합니다',
    trigger: '사용자가 코드 리뷰를 요청하면',
    body: '팀 페르소나 기반 코드 리뷰를 실행합니다.\n\n절차:\n1. 리뷰한다',
  };

  it('.agents/skills/ 경로를 생성한다', () => {
    const result = toCodexSkill(skill);
    expect(result.path).toBe('.agents/skills/conor-review/SKILL.md');
  });

  it('YAML frontmatter를 --- 구분자로 포함한다', () => {
    const result = toCodexSkill(skill);
    expect(result.content).toMatch(/^---\n[\s\S]*?\n---/);
  });

  it('frontmatter에 name, description, trigger를 포함한다', () => {
    const result = toCodexSkill(skill);
    const frontmatter = result.content.match(/^---\n([\s\S]*?)\n---/)![1];

    expect(frontmatter).toContain('name: conor-review');
    expect(frontmatter).toContain('description:');
    expect(frontmatter).toContain('trigger:');
  });

  it('frontmatter 이후에 body를 포함한다', () => {
    const result = toCodexSkill(skill);
    const afterFrontmatter = result.content.replace(/^---\n[\s\S]*?\n---\n*/, '');

    expect(afterFrontmatter).toContain('절차:');
    expect(afterFrontmatter).toContain('리뷰한다');
  });

  it('description이 없으면 frontmatter에서 생략한다', () => {
    const minimal: SkillMeta = { name: 'test', description: '', trigger: '', body: '본문' };
    const result = toCodexSkill(minimal);

    expect(result.content).not.toContain('description:');
    expect(result.content).not.toContain('trigger:');
  });

  it('parseSkillTemplate로 다시 파싱할 수 있다 (roundtrip)', () => {
    const result = toCodexSkill(skill);
    const parsed = parseSkillTemplate(result.content);

    expect(parsed.name).toBe(skill.name);
    expect(parsed.description).toBe(skill.description);
    expect(parsed.trigger).toBe(skill.trigger);
    expect(parsed.body).toContain('절차:');
  });
});
