export type LogLevel = 'debug' | 'info' | 'success' | 'warn' | 'error';

let logLevel = 0;

const logLevelOrder: LogLevel[] = ['debug', 'info', 'success', 'warn', 'error'];

const logColor: { [key in LogLevel]: string } = {
  debug: '\x1b[0m',
  info: '\x1b[36m',
  success: '\x1b[32m',
  warn: '\x1b[33m',
  error: '\x1b[31m',
};

export function setLogLevel(level: LogLevel) {
  logLevel = logLevelOrder.indexOf(level);
}

export function log(level: LogLevel, message: string) {
  if (logLevelOrder.indexOf(level) < logLevel) return;

  const color = logColor[level];
  const reset = '\x1b[0m';

  console.log(`${color}${message}${reset}`);
}

export function debug(message: string) {
  log('debug', message);
}

export function info(message: string) {
  log('info', message);
}

export function success(message: string) {
  log('success', message);
}

export function warn(message: string) {
  log('warn', message);
}

export function error(message: string) {
  log('error', message);
}
