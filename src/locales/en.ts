import type { Messages } from './types.js';

export const en: Messages = {
  // init command
  initTitle: 'Team Conor - AI Team Persona Setup',
  updateDetected: 'Existing configuration detected. Proceeding in update mode.',
  nameRequired: '--name option is required in --no-interaction mode.',
  nameRequiredExample: '  e.g.: team-conor init --name "John" --no-interaction',
  enterName: 'Enter your name',
  enterNameValidation: 'Please enter your name',
  cancelled: 'Cancelled',
  personaFiles: 'Persona files:',
  memoryFiles: 'Memory files:',
  claudeMd: 'CLAUDE.md:',
  done: 'Done!',
  teamIntro: (name: string) => `${name}'s team:`,
  teamMembers1: '  Steve (Strategy) | Elon (PM) | Marco (UX)',
  teamMembers2: '  Yuna (Frontend)  | Viktor (Backend)',
  usageHint: 'Usage: Call a team member like "Yuna, review this code"',

  // init command descriptions
  initDescription: 'Set up AI team personas for your project',
  optionName: 'User name (required in non-interactive mode)',
  optionForce: 'Overwrite existing files without asking',
  optionNoInteraction: 'Non-interactive mode (for CI/CD, etc.)',

  // language selection
  selectLanguage: 'Select language',

  // file utils
  noChange: 'no changes',
  keepMemory: 'kept - memory',
  skipped: 'skipped',
  backupCreated: 'backup created',
  fileExists: 'file already exists',
  overwrite: 'Overwrite',
  skip: 'Skip',
  backupAndOverwrite: 'Backup and overwrite',

  // diff
  diffCurrent: 'current',
  diffNew: 'new version',
  diffMoreLines: (count: number) => `${count} more lines`,

  // summary.md
  summaryComment1: 'This file is referenced from CLAUDE.md.',
  summaryComment2: 'Keep the core project context concise.',
  summaryComment3: 'Record details in other memory files.',
  summaryProject: '<!-- Tech stack, architecture summary -->',
  summaryDecisions: '<!-- Recent key decisions -->',
  summaryActive: '<!-- Current work in progress -->',
  summaryCreated: '+ summary.md',
  summaryKept: '- summary.md (kept)',
};
