import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import prompts from 'prompts';
import * as logger from '../utils/logger.js';
import { writeFileWithConfirm, ensureDir } from '../utils/file.js';
import { t } from '../locales/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const templatesDir = path.join(__dirname, '..', '..', 'templates', 'ko');

const AGENT_MAP: Record<string, string> = {
  claude: 'CLAUDE.md',
  codex: 'AGENTS.md',
};

interface PersonaMeta {
  key: string;
  file: string;
  role: string;
  label: string;
  deepWorkflow: { file: string; type: string; desc: string } | null;
}

const ALL_PERSONAS: PersonaMeta[] = [
  {
    key: 'planner', file: 'planner.md', role: 'planner',
    label: '스티브 - 제품 전략가',
    deepWorkflow: { file: 'deep-plan.md', type: 'deep-plan',
      desc: '스티브(planner)에게 심층적인 분석을 명시적으로 요청한 경우에만 읽으세요.' },
  },
  {
    key: 'pm', file: 'pm.md', role: 'pm',
    label: '엘런 - 실행 PM',
    deepWorkflow: null,
  },
  {
    key: 'designer', file: 'designer.md', role: 'designer',
    label: '마르코 - UX 전문가',
    deepWorkflow: { file: 'deep-design.md', type: 'deep-design',
      desc: '마르코(designer)에게 심층적인 분석을 명시적으로 요청한 경우에만 읽으세요.' },
  },
  {
    key: 'frontend', file: 'frontend.md', role: 'frontend',
    label: '유나 - FE 아키텍트',
    deepWorkflow: { file: 'deep-client.md', type: 'deep-client',
      desc: '유나(frontend)에게 심층적인 분석을 명시적으로 요청한 경우에만 읽으세요.' },
  },
  {
    key: 'backend', file: 'backend.md', role: 'backend',
    label: '빅토르 - BE 아키텍트',
    deepWorkflow: { file: 'deep-server.md', type: 'deep-server',
      desc: '빅토르(backend)에게 심층적인 분석을 명시적으로 요청한 경우에만 읽으세요.' },
  },
  {
    key: 'game', file: 'game.md', role: 'game',
    label: '레이나 - 게임 클라이언트 개발자',
    deepWorkflow: { file: 'deep-game.md', type: 'deep-game',
      desc: '레이나(game)에게 심층적인 분석을 명시적으로 요청한 경우에만 읽으세요.' },
  },
  {
    key: 'app', file: 'app.md', role: 'app',
    label: '하루 - 앱 개발자',
    deepWorkflow: { file: 'deep-app.md', type: 'deep-app',
      desc: '하루(app)에게 심층적인 분석을 명시적으로 요청한 경우에만 읽으세요.' },
  },
];

interface InitOptions {
  name?: string;
  force: boolean;
  interaction: boolean;
  agent?: string[];
  persona?: string[];
  version: string;
}

export async function run(options: InitOptions): Promise<void> {
  logger.newline();

  const msg = t();

  logger.info(msg.initTitle);
  logger.newline();

  const cwd = process.cwd();

  // Detect migration: existing CLAUDE.md with TEAM CONOR TEMPLATE marker, or old root CONOR.md
  const claudeMdPath = path.join(cwd, 'CLAUDE.md');
  const conorMdPath = path.join(cwd, '.conor', 'CONOR.md');
  const oldConorMdPath = path.join(cwd, 'CONOR.md');
  const claudeMdExists = fs.existsSync(claudeMdPath);
  const conorMdExists = fs.existsSync(conorMdPath);
  const oldConorMdExists = fs.existsSync(oldConorMdPath);
  const needsMigration = claudeMdExists && fs.readFileSync(claudeMdPath, 'utf-8').includes('TEAM CONOR TEMPLATE');
  const isUpdate = conorMdExists && fs.readFileSync(conorMdPath, 'utf-8').includes('TEAM CONOR TEMPLATE');
  const needsConorMove = !conorMdExists && oldConorMdExists && fs.readFileSync(oldConorMdPath, 'utf-8').includes('TEAM CONOR TEMPLATE');

  if (needsMigration || needsConorMove) {
    logger.warn(msg.migrationDetected);
    logger.newline();
  } else if (isUpdate) {
    logger.warn(msg.updateDetected);
    logger.newline();
  }

  // --- Name input ---
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

  // --- Persona selection ---
  let selectedPersonas = resolvePersonas(options.persona);

  if (!selectedPersonas) {
    if (!options.interaction) {
      // Non-interactive without --persona: select all
      selectedPersonas = ALL_PERSONAS;
    } else {
      selectedPersonas = await promptPersonaSelection(msg, cwd, isUpdate || needsMigration || needsConorMove);

      if (!selectedPersonas || selectedPersonas.length === 0) {
        logger.warn(msg.cancelled);
        process.exit(0);
      }
    }
  }

  // --- Agent selection ---
  let selectedAgents = resolveAgents(options.agent);

  if (!selectedAgents) {
    if (!options.interaction) {
      logger.error(msg.agentRequired);
      logger.dim(msg.nameRequiredExample);
      process.exit(1);
    }

    selectedAgents = await promptAgentSelection(msg);

    if (!selectedAgents || selectedAgents.length === 0) {
      logger.warn(msg.cancelled);
      process.exit(0);
    }
  }

  // --- Directory setup ---
  ensureDir(path.join(cwd, '.conor', 'persona'));
  ensureDir(path.join(cwd, '.conor', 'memory'));
  ensureDir(path.join(cwd, '.conor', 'memory', '_schema'));
  ensureDir(path.join(cwd, '.conor', 'memory', 'chunks'));
  ensureDir(path.join(cwd, '.conor', 'workflows'));

  const writeOpts = {
    alwaysAsk: (isUpdate || needsMigration || needsConorMove) && options.interaction,
    force: options.force,
  };

  // --- Persona files ---
  logger.newline();
  logger.info(msg.personaFiles);

  const selectedPersonaFiles = selectedPersonas.map((p) => p.file);

  for (const file of selectedPersonaFiles) {
    const src = path.join(templatesDir, 'persona', file);
    const dest = path.join(cwd, '.conor', 'persona', file);
    const content = fs.readFileSync(src, 'utf-8');
    await writeFileWithConfirm(dest, content, writeOpts);
  }

  const userTemplate = fs.readFileSync(path.join(templatesDir, 'persona', 'user.md'), 'utf-8');
  const userContent = userTemplate.replace(/\{\{userName\}\}/g, userName);
  await writeFileWithConfirm(
    path.join(cwd, '.conor', 'persona', 'user.md'),
    userContent,
    writeOpts,
  );

  // --- Memory files ---
  logger.newline();
  logger.info(msg.memoryFiles);

  const schemaFiles = ['learning.md', 'decision.md', 'project.md'];

  for (const file of schemaFiles) {
    const src = path.join(templatesDir, 'memory', '_schema', file);
    const dest = path.join(cwd, '.conor', 'memory', '_schema', file);
    const content = fs.readFileSync(src, 'utf-8');
    await writeFileWithConfirm(dest, content, writeOpts);
  }

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

  logger.success(`  ${msg.chunksReady}`);

  // --- Workflow files ---
  logger.newline();
  logger.info(msg.workflowFiles);

  const baseWorkflowFiles = ['work.md', 'review.md', 'meeting.md'];
  const selectedDeepWorkflows = selectedPersonas
    .filter((p) => p.deepWorkflow !== null)
    .map((p) => p.deepWorkflow!.file);
  const workflowFiles = [...baseWorkflowFiles, ...selectedDeepWorkflows];

  for (const file of workflowFiles) {
    const src = path.join(templatesDir, 'workflows', file);
    const dest = path.join(cwd, '.conor', 'workflows', file);
    const content = fs.readFileSync(src, 'utf-8');
    await writeFileWithConfirm(dest, content, writeOpts);
  }

  // --- CONOR.md (template) ---
  logger.newline();
  logger.info(msg.conorMd);

  const conorTemplate = fs.readFileSync(path.join(templatesDir, 'CONOR.md'), 'utf-8');

  // Build personas block
  const personasBlock = selectedPersonas
    .map((p) => `    <persona role="${p.role}">${p.label}</persona>`)
    .join('\n') + '\n';

  // Build deep-workflows block
  const deepWorkflowLines = selectedPersonas
    .filter((p) => p.deepWorkflow !== null)
    .map((p) => {
      const dw = p.deepWorkflow!;
      return `    <workflow type="${dw.type}" file=".conor/workflows/${dw.file}">\n        ${dw.desc}\n    </workflow>`;
    });
  const deepWorkflows = deepWorkflowLines.length > 0
    ? deepWorkflowLines.join('\n') + '\n'
    : '';

  const renderedTemplate = conorTemplate
    .replace(/\{\{userName\}\}/g, userName)
    .replace(/\{\{personasBlock\}\}/, personasBlock)
    .replace(/\{\{deepWorkflows\}\}/, deepWorkflows);

  const TEMPLATE_START_RE = /<!-- TEAM CONOR TEMPLATE[^-]*-->/;
  const TEMPLATE_END = '<!-- END TEAM CONOR TEMPLATE -->';
  const templateMarkerStart = `<!-- TEAM CONOR TEMPLATE v${options.version} -->`;
  const templateBlock = `${templateMarkerStart}\n${renderedTemplate}\n${TEMPLATE_END}`;

  if (needsMigration) {
    // Migration: extract template content from CLAUDE.md → .conor/CONOR.md
    const claudeContent = fs.readFileSync(claudeMdPath, 'utf-8');
    const startMatch = claudeContent.match(TEMPLATE_START_RE);
    const endIndex = claudeContent.indexOf(TEMPLATE_END);

    if (startMatch && startMatch.index !== undefined && endIndex !== -1) {
      fs.writeFileSync(conorMdPath, templateBlock + '\n');
      logger.success(`  + .conor/CONOR.md (${msg.templateRegionUpdated})`);

      // Replace the template region in CLAUDE.md with agent region
      const agentTemplate = fs.readFileSync(path.join(templatesDir, 'agents', 'agent.md'), 'utf-8');
      const AGENT_START = `<!-- TEAM CONOR AGENT v${options.version} -->`;
      const AGENT_END = '<!-- END TEAM CONOR AGENT -->';
      const agentBlock = `${AGENT_START}\n${agentTemplate}${AGENT_END}`;

      const before = claudeContent.substring(0, startMatch.index);
      const after = claudeContent.substring(endIndex + TEMPLATE_END.length);
      const migratedClaude = before + agentBlock + after;
      fs.writeFileSync(claudeMdPath, migratedClaude);
      logger.success(`  + CLAUDE.md (${msg.agentRegionUpdated})`);
    }
  } else if (needsConorMove) {
    // Migration: move root CONOR.md → .conor/CONOR.md
    fs.writeFileSync(conorMdPath, templateBlock + '\n');
    fs.unlinkSync(oldConorMdPath);
    logger.success(`  + .conor/CONOR.md (${msg.templateRegionUpdated})`);
  } else {
    writeMarkerRegion(conorMdPath, templateBlock, TEMPLATE_START_RE, TEMPLATE_END, '.conor/CONOR.md', msg.templateRegionUpdated, msg.templateRegionNoChange, writeOpts);
  }

  // --- Agent files ---
  logger.newline();
  logger.info(msg.agentFiles);

  const AGENT_START_RE = /<!-- TEAM CONOR AGENT[^-]*-->/;
  const AGENT_END = '<!-- END TEAM CONOR AGENT -->';
  const agentMarkerStart = `<!-- TEAM CONOR AGENT v${options.version} -->`;

  for (const agentFile of selectedAgents) {
    const agentFilePath = path.join(cwd, agentFile);
    const agentContent = fs.readFileSync(path.join(templatesDir, 'agents', 'agent.md'), 'utf-8');

    const agentBlock = `${agentMarkerStart}\n${agentContent}${AGENT_END}`;

    // Skip if this file was already handled by migration
    if (needsMigration && agentFile === 'CLAUDE.md') {
      continue;
    }

    writeMarkerRegion(agentFilePath, agentBlock, AGENT_START_RE, AGENT_END, agentFile, msg.agentRegionUpdated, msg.agentRegionNoChange, writeOpts);
  }

  // --- Done ---
  logger.newline();
  logger.success(msg.done);
  logger.newline();
  logger.info(msg.teamIntro(userName));
  const personaLabels = selectedPersonas.map((p) => p.label);
  for (let i = 0; i < personaLabels.length; i += 3) {
    const line = personaLabels.slice(i, i + 3).map((l) => l).join(' | ');
    logger.dim(`  ${line}`);
  }
  logger.newline();
  logger.dim(msg.usageHint);
  logger.newline();
}

function writeMarkerRegion(
  filePath: string,
  newBlock: string,
  startRe: RegExp,
  endMarker: string,
  displayName: string,
  updatedMsg: string,
  noChangeMsg: string,
  writeOpts: { alwaysAsk: boolean; force: boolean },
): void {
  if (fs.existsSync(filePath)) {
    const existing = fs.readFileSync(filePath, 'utf-8');
    const startMatch = existing.match(startRe);
    const endIndex = existing.indexOf(endMarker);

    if (startMatch && startMatch.index !== undefined && endIndex !== -1) {
      const before = existing.substring(0, startMatch.index);
      const after = existing.substring(endIndex + endMarker.length);
      const merged = before + newBlock + after;

      if (existing === merged) {
        logger.dim(`  - ${displayName} (${noChangeMsg})`);
      } else {
        fs.writeFileSync(filePath, merged);
        logger.success(`  + ${displayName} (${updatedMsg})`);
      }
    } else {
      // File exists but no marker region — prepend the block
      const merged = newBlock + '\n' + existing;
      fs.writeFileSync(filePath, merged);
      logger.success(`  + ${displayName} (${updatedMsg})`);
    }
  } else {
    fs.writeFileSync(filePath, newBlock + '\n');
    logger.success(`  + ${displayName}`);
  }
}

function resolvePersonas(personaArgs?: string[]): PersonaMeta[] | null {
  if (!personaArgs || personaArgs.length === 0) return null;

  const result: PersonaMeta[] = [];
  for (const arg of personaArgs) {
    const found = ALL_PERSONAS.find((p) => p.key === arg.toLowerCase());
    if (found) {
      result.push(found);
    } else {
      logger.warn(`  unknown persona: ${arg}`);
    }
  }
  return result.length > 0 ? result : null;
}

async function promptPersonaSelection(
  msg: ReturnType<typeof t>,
  cwd: string,
  isUpdate: boolean,
): Promise<PersonaMeta[] | null> {
  const personaDir = path.join(cwd, '.conor', 'persona');
  const existingFiles = isUpdate && fs.existsSync(personaDir)
    ? fs.readdirSync(personaDir)
    : [];

  const response = await prompts({
    type: 'multiselect',
    name: 'personas',
    message: msg.selectPersona,
    choices: ALL_PERSONAS.map((p) => ({
      title: p.label,
      value: p.key,
      selected: isUpdate ? existingFiles.includes(p.file) : true,
    })),
    hint: '- 스페이스바로 선택, 엔터로 확인',
  });

  if (!response.personas || response.personas.length === 0) return null;

  return (response.personas as string[])
    .map((key) => ALL_PERSONAS.find((p) => p.key === key)!)
    .filter(Boolean);
}

function resolveAgents(agentArgs?: string[]): string[] | null {
  if (!agentArgs || agentArgs.length === 0) return null;

  return agentArgs.map((arg) => {
    const lower = arg.toLowerCase();
    if (AGENT_MAP[lower]) return AGENT_MAP[lower];
    // Custom filename — ensure .md extension
    return arg.endsWith('.md') ? arg : `${arg}.md`;
  });
}

async function promptAgentSelection(msg: ReturnType<typeof t>): Promise<string[] | null> {
  const response = await prompts({
    type: 'multiselect',
    name: 'agents',
    message: msg.selectAgent,
    choices: [
      { title: msg.agentClaude, value: 'claude', selected: true },
      { title: msg.agentCodex, value: 'codex' },
      { title: msg.agentCustom, value: 'custom' },
    ],
    hint: '- 스페이스바로 선택, 엔터로 확인',
  });

  if (!response.agents || response.agents.length === 0) return null;

  const agents: string[] = [];

  for (const agent of response.agents as string[]) {
    if (agent === 'custom') {
      const customResponse = await prompts({
        type: 'text',
        name: 'filename',
        message: msg.enterAgentFilename,
        validate: (value: string) => (value.length > 0 ? true : msg.enterNameValidation),
      });

      if (customResponse.filename) {
        const filename = customResponse.filename as string;
        agents.push(filename.endsWith('.md') ? filename : `${filename}.md`);
      }
    } else {
      agents.push(AGENT_MAP[agent]);
    }
  }

  return agents.length > 0 ? agents : null;
}
