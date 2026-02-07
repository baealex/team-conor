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
  claudeMd: string;
  done: string;
  teamIntro: (name: string) => string;
  teamMembers1: string;
  teamMembers2: string;
  usageHint: string;

  // init command descriptions
  initDescription: string;
  optionName: string;
  optionForce: string;
  optionNoInteraction: string;

  // language selection
  selectLanguage: string;

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
}

export type Locale = 'ko' | 'en' | 'ja';
