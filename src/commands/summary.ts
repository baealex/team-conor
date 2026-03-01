import fs from 'fs';
import path from 'path';
import * as logger from '../utils/logger.js';
import { t } from '../locales/index.js';

interface ChunkMeta {
  id: string;
  filename: string;
  type: string;
  date: string;
  tags: string[];
  summary: string;
}

function parseFrontmatter(content: string): Record<string, string> {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return {};

  const fields: Record<string, string> = {};
  for (const line of match[1].split('\n')) {
    const colonIndex = line.indexOf(':');
    if (colonIndex === -1) continue;
    const key = line.substring(0, colonIndex).trim();
    const value = line.substring(colonIndex + 1).trim();
    fields[key] = value;
  }
  return fields;
}

function parseTags(raw: string): string[] {
  const match = raw.match(/\[(.*)\]/);
  if (!match) return [];
  return match[1].split(',').map((t) => t.trim()).filter(Boolean);
}

function extractSummary(content: string): string {
  const afterFrontmatter = content.replace(/^---[\s\S]*?---\n*/, '');
  const boldMatch = afterFrontmatter.match(/\*\*[^*]+\*\*:\s*(.+)/);
  return boldMatch ? boldMatch[1].trim() : '';
}

function parseChunk(filepath: string): ChunkMeta | null {
  const content = fs.readFileSync(filepath, 'utf-8');
  const filename = path.basename(filepath, '.md');
  const frontmatter = parseFrontmatter(content);

  if (!frontmatter.type || !frontmatter.date) return null;

  return {
    id: filename,
    filename: path.basename(filepath),
    type: frontmatter.type,
    date: frontmatter.date,
    tags: parseTags(frontmatter.tags || '[]'),
    summary: extractSummary(content),
  };
}

function typeToGroup(type: string): string {
  switch (type) {
    case 'project': return 'Project';
    case 'decision': return 'Decisions';
    case 'learning': return 'Learnings';
    default: return 'Other';
  }
}

function typeOrder(type: string): number {
  switch (type) {
    case 'project': return 0;
    case 'decision': return 1;
    case 'learning': return 2;
    default: return 3;
  }
}

export async function run(): Promise<void> {
  const msg = t();
  const cwd = process.cwd();
  const chunksDir = path.join(cwd, '.conor', 'memory', 'chunks');
  const summaryPath = path.join(cwd, '.conor', 'memory', 'summary.md');

  if (!fs.existsSync(chunksDir)) {
    logger.error(msg.summaryNoChunksDir);
    return;
  }

  const files = fs.readdirSync(chunksDir).filter((f) => f.endsWith('.md'));

  if (files.length === 0) {
    logger.warn(msg.summaryNoChunks);
    return;
  }

  const chunks: ChunkMeta[] = [];
  for (const file of files) {
    const meta = parseChunk(path.join(chunksDir, file));
    if (meta) chunks.push(meta);
  }

  if (chunks.length === 0) {
    logger.warn(msg.summaryNoValidChunks);
    return;
  }

  // Group by type, sort by date descending within each group
  const groups = new Map<string, ChunkMeta[]>();
  for (const chunk of chunks) {
    const group = typeToGroup(chunk.type);
    if (!groups.has(group)) groups.set(group, []);
    groups.get(group)!.push(chunk);
  }

  for (const items of groups.values()) {
    items.sort((a, b) => b.date.localeCompare(a.date));
  }

  // Sort groups by type order
  const sortedGroups = [...groups.entries()].sort(
    (a, b) => typeOrder(a[1][0].type) - typeOrder(b[1][0].type)
  );

  // Generate summary.md
  const lines: string[] = ['# Memory Index', ''];

  for (const [group, items] of sortedGroups) {
    lines.push(`## ${group}`);
    for (const chunk of items) {
      const tags = chunk.tags.map((t) => `#${t}`).join(' ');
      const tagsPart = tags ? ` | ${tags}` : '';
      lines.push(`- [${chunk.id}](chunks/${chunk.filename}) ${chunk.summary}${tagsPart} (${chunk.date})`);
    }
    lines.push('');
  }

  fs.writeFileSync(summaryPath, lines.join('\n'));
  logger.success(msg.summaryGenerated(chunks.length));
}
