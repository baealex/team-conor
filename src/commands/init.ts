import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import * as logger from '../utils/logger.js';
import { writeFileWithConfirm, ensureDir } from '../utils/file.js';
import { setLocale, getLocale, t, localeChoices } from '../locales/index.js';
import type { Locale } from '../locales/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '..', '..', 'templates');

interface InitOptions {
  name?: string;
  force: boolean;
  interaction: boolean;
  lang?: string;
}

export async function run(options: InitOptions): Promise<void> {
  logger.newline();

  // Language selection
  if (options.lang && ['ko', 'en', 'ja'].includes(options.lang)) {
    setLocale(options.lang as Locale);
  } else if (options.interaction) {
    const langResponse = await prompts({
      type: 'select',
      name: 'locale',
      message: '🌐 Language / 언어 / 言語',
      choices: localeChoices,
    });

    if (!langResponse.locale) {
      logger.warn('Cancelled');
      process.exit(0);
    }

    setLocale(langResponse.locale as Locale);
  }

  const msg = t();
  const locale = getLocale();
  const langTemplatesDir = path.join(templatesDir, locale);

  logger.info(msg.initTitle);
  logger.newline();

  const cwd = process.cwd();
  const isUpdate = fs.existsSync(path.join(cwd, 'CLAUDE.md'));

  if (isUpdate) {
    logger.warn(msg.updateDetected);
    logger.newline();
  }

  let userName = options.name;

  if (!userName) {
    if (!options.interaction) {
      logger.error(msg.nameRequired);
      logger.dim(msg.nameRequiredExample);
      process.exit(1);
    }

    const response = await prompts({
      type: 'text',
      name: 'userName',
      message: msg.enterName,
      validate: (value: string) => (value.length > 0 ? true : msg.enterNameValidation),
    });

    if (!response.userName) {
      logger.warn(msg.cancelled);
      process.exit(0);
    }

    userName = response.userName as string;
  }

  ensureDir(path.join(cwd, '.conor', 'persona'));
  ensureDir(path.join(cwd, '.conor', 'memory'));
  ensureDir(path.join(cwd, '.conor', 'memory', '_schema'));
  ensureDir(path.join(cwd, '.conor', 'memory', 'chunks'));

  const writeOpts = {
    alwaysAsk: isUpdate && options.interaction,
    force: options.force,
  };

  logger.newline();
  logger.info(msg.personaFiles);

  const personaFiles = ['backend.md', 'designer.md', 'frontend.md', 'planner.md', 'pm.md'];

  for (const file of personaFiles) {
    const src = path.join(langTemplatesDir, 'persona', file);
    const dest = path.join(cwd, '.conor', 'persona', file);
    const content = fs.readFileSync(src, 'utf-8');
    await writeFileWithConfirm(dest, content, writeOpts);
  }

  const userTemplate = fs.readFileSync(path.join(langTemplatesDir, 'persona', 'user.md'), 'utf-8');
  const userContent = userTemplate.replace(/\{\{userName\}\}/g, userName);
  await writeFileWithConfirm(
    path.join(cwd, '.conor', 'persona', 'user.md'),
    userContent,
    writeOpts,
  );

  logger.newline();
  logger.info(msg.memoryFiles);

  // Schema files (format definitions for chunk creation)
  const schemaFiles = ['learning.md', 'decision.md', 'project.md'];

  for (const file of schemaFiles) {
    const src = path.join(langTemplatesDir, 'memory', '_schema', file);
    const dest = path.join(cwd, '.conor', 'memory', '_schema', file);
    const content = fs.readFileSync(src, 'utf-8');
    await writeFileWithConfirm(dest, content, writeOpts);
  }

  // Summary (Zettelkasten index — always loaded into AI context)
  const summaryPath = path.join(cwd, '.conor', 'memory', 'summary.md');
  if (!fs.existsSync(summaryPath)) {
    const summaryContent = `# Memory Index

<!--
${msg.summaryComment1}
${msg.summaryComment2}
${msg.summaryComment3}
${msg.summaryComment4}
-->

## Project
${msg.summaryProject}

## Decisions
${msg.summaryDecisions}

## Learnings
${msg.summaryLearnings}
`;
    fs.writeFileSync(summaryPath, summaryContent);
    logger.success(`  ${msg.summaryCreated}`);
  } else {
    logger.warn(`  ${msg.summaryKept}`);
  }

  // Chunks directory info
  logger.success(`  ${msg.chunksReady}`);

  logger.newline();
  logger.info(msg.claudeMd);

  const claudeTemplate = fs.readFileSync(path.join(langTemplatesDir, 'CLAUDE.md'), 'utf-8');
  const claudeContent = claudeTemplate.replace(/\{\{userName\}\}/g, userName);
  await writeFileWithConfirm(path.join(cwd, 'CLAUDE.md'), claudeContent, writeOpts);

  logger.newline();
  logger.success(msg.done);
  logger.newline();
  logger.info(msg.teamIntro(userName));
  logger.dim(msg.teamMembers1);
  logger.dim(msg.teamMembers2);
  logger.newline();
  logger.dim(msg.usageHint);
  logger.newline();
}
