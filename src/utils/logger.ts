const COLORS = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
} as const;

type ColorName = keyof typeof COLORS;

export function log(message: string, color: ColorName = 'reset'): void {
  console.log(`${COLORS[color]}${message}${COLORS.reset}`);
}

export function info(message: string): void {
  log(message, 'cyan');
}

export function success(message: string): void {
  log(message, 'green');
}

export function warn(message: string): void {
  log(message, 'yellow');
}

export function error(message: string): void {
  log(message, 'red');
}

export function dim(message: string): void {
  log(message, 'dim');
}

export function bold(message: string): void {
  log(message, 'bold');
}

export function newline(): void {
  console.log();
}
