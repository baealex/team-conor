import fs from 'fs';
import path from 'path';
import { describe, expect, it } from 'vitest';
import { ALL_PERSONAS } from '../commands/init.js';

const templatesDir = path.resolve(__dirname, '..', '..', 'templates', 'ko');
const personaDir = path.join(templatesDir, 'persona');
const workflowsDir = path.join(templatesDir, 'workflows');

describe('ALL_PERSONAS ↔ template file sync', () => {
  it('each persona file exists in templates/ko/persona/', () => {
    for (const persona of ALL_PERSONAS) {
      const filePath = path.join(personaDir, persona.file);
      expect(
        fs.existsSync(filePath),
        `Missing persona template: ${persona.file}`,
      ).toBe(true);
    }
  });

  it('each deepWorkflow file exists in templates/ko/workflows/', () => {
    for (const persona of ALL_PERSONAS) {
      if (persona.deepWorkflow) {
        const filePath = path.join(workflowsDir, persona.deepWorkflow.file);
        expect(
          fs.existsSync(filePath),
          `Missing workflow template: ${persona.deepWorkflow.file}`,
        ).toBe(true);
      }
    }
  });

  it('every persona template (except user.md) is registered in ALL_PERSONAS', () => {
    const files = fs
      .readdirSync(personaDir)
      .filter((f) => f.endsWith('.md') && f !== 'user.md');
    const registered = new Set(ALL_PERSONAS.map((p) => p.file));
    for (const file of files) {
      expect(
        registered.has(file),
        `Template ${file} is not registered in ALL_PERSONAS`,
      ).toBe(true);
    }
  });

  it('every deep-*.md workflow is registered in ALL_PERSONAS deepWorkflow', () => {
    const files = fs
      .readdirSync(workflowsDir)
      .filter((f) => f.startsWith('deep-') && f.endsWith('.md'));
    const registered = new Set(
      ALL_PERSONAS.filter((p) => p.deepWorkflow !== null).map(
        (p) => p.deepWorkflow!.file,
      ),
    );
    for (const file of files) {
      expect(
        registered.has(file),
        `Workflow ${file} is not registered in ALL_PERSONAS`,
      ).toBe(true);
    }
  });
});
