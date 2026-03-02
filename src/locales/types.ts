export interface Messages {
  // init command
  initTitle: string;
  updateDetected: string;
  nameRequired: string;
  nameRequiredExample: string;
  enterName: string;
  enterNameValidation: string;
  cancelled: string;
  personaFiles: string;
  memoryFiles: string;
  conorMd: string;
  agentFiles: string;
  done: string;
  teamIntro: (name: string) => string;
  teamMembers1: string;
  teamMembers2: string;
  usageHint: string;

  // agent selection
  selectAgent: string;
  agentClaude: string;
  agentCodex: string;
  agentCustom: string;
  enterAgentFilename: string;
  agentRequired: string;

  // persona selection
  selectPersona: string;
  personaRequired: string;

  // migration
  migrationDetected: string;

  // init command descriptions
  initDescription: string;
  optionName: string;
  optionForce: string;
  optionNoInteraction: string;
  agentOption: string;

  // file utils
  noChange: string;
  keepMemory: string;
  skipped: string;
  backupCreated: string;
  fileExists: string;
  overwrite: string;
  skip: string;
  backupAndOverwrite: string;

  // diff
  diffCurrent: string;
  diffNew: string;
  diffMoreLines: (count: number) => string;

  // summary.md (Zettelkasten index)
  summaryComment1: string;
  summaryComment2: string;
  summaryComment3: string;
  summaryComment4: string;
  summaryProject: string;
  summaryDecisions: string;
  summaryLearnings: string;
  summaryCreated: string;
  summaryKept: string;

  // chunks
  chunksReady: string;

  // CONOR.md template markers
  templateRegionUpdated: string;
  templateRegionNoChange: string;

  // Agent file markers
  agentRegionUpdated: string;
  agentRegionNoChange: string;

  // workflow files
  workflowFiles: string;

  // summary command
  summaryDescription: string;
  summaryNoChunksDir: string;
  summaryNoChunks: string;
  summaryNoValidChunks: string;
  summaryGenerated: (count: number) => string;
}
