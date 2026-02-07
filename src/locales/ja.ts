import type { Messages } from './types.js';

export const ja: Messages = {
  // init command
  initTitle: 'Team Conor - AIチームペルソナ設定',
  updateDetected: '既存の設定が検出されました。更新モードで続行します。',
  nameRequired: '--no-interactionモードでは--nameオプションが必要です。',
  nameRequiredExample: '  例: team-conor init --name "太郎" --no-interaction',
  enterName: '名前を入力してください',
  enterNameValidation: '名前を入力してください',
  cancelled: 'キャンセルされました',
  personaFiles: 'ペルソナファイル:',
  memoryFiles: 'Memoryファイル:',
  claudeMd: 'CLAUDE.md:',
  done: '完了！',
  teamIntro: (name: string) => `${name}のチーム:`,
  teamMembers1: '  スティーブ (戦略) | エロン (PM) | マルコ (UX)',
  teamMembers2: '  ユナ (Frontend)   | ヴィクトル (Backend)',
  usageHint: '使い方: 「ユナ、このコードをレビューして」のようにチームメンバーを呼んでください',

  // init command descriptions
  initDescription: 'プロジェクトにAIチームペルソナを設定します',
  optionName: 'ユーザー名（非対話モードで必須）',
  optionForce: '確認なしで既存ファイルを上書き',
  optionNoInteraction: '非対話モード（CI/CDなど）',

  // language selection
  selectLanguage: '言語を選択してください',

  // file utils
  noChange: '変更なし',
  keepMemory: '既存維持 - memory',
  skipped: 'スキップ',
  backupCreated: 'バックアップ作成',
  fileExists: 'ファイルが既に存在します',
  overwrite: '上書き',
  skip: 'スキップ',
  backupAndOverwrite: 'バックアップして上書き',

  // diff
  diffCurrent: '現在',
  diffNew: '新バージョン',
  diffMoreLines: (count: number) => `他${count}行`,

  // summary.md
  summaryComment1: 'このファイルはCLAUDE.mdから参照されます。',
  summaryComment2: 'プロジェクトのコアコンテキストを簡潔に保ってください。',
  summaryComment3: '詳細は他のmemoryファイルに記録してください。',
  summaryProject: '<!-- 技術スタック、アーキテクチャ概要 -->',
  summaryDecisions: '<!-- 最近の主要な決定事項 -->',
  summaryActive: '<!-- 現在作業中の内容 -->',
  summaryCreated: '+ summary.md',
  summaryKept: '- summary.md (既存維持)',
};
