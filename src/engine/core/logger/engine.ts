import { LoggerEngine } from './models.js';

export const InternalLoggerEngine: LoggerEngine = {
  default: (m, ...p) => console.log(m, ...p),
  engine: (m, ...p) => console.log(m, ...p),
  info: (m, ...p) => console.info(m, ...p),
  debug: (m, ...p) => console.debug(m, ...p),
  warning: (m, ...p) => console.warn(m, ...p),
  error: (m, ...p) => console.error(m, ...p),
};
