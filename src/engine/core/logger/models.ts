export enum LogLevel {
  disabled = 0,
  error = 10,
  warning = 20,
  info = 30,
  debug = 40,
  engine = 50,
  all = 100,
}

export interface LogOption {
  /** Log level */
  level: number,
  /** Message to show */
  message: string;
  /** extra params */
  params?: unknown[];
  /** only log, if false */
  assert?: boolean;
  /** timmer name */
  timer?: string;
  /** preserve {} value by stringify */
  preserve?: boolean;
}

export type LogOptionExtra = {
  /** only log, if false */
  $assert?: boolean;
  /** timmer name */
  $timer?: string;
  /** preserve {} value by stringify */
  $preserve?: boolean;
}

export interface LoggerEngine {
  error(message: string, ...params: unknown[]): Promise<unknown> | unknown;
  warning(message: string, ...params: unknown[]): Promise<unknown> | unknown;
  info(message: string, ...params: unknown[]): Promise<unknown> | unknown;
  debug(message: string, ...params: unknown[]): Promise<unknown> | unknown;
  engine(message: string, ...params: unknown[]): Promise<unknown> | unknown;
  default(message: string, ...params: unknown[]): Promise<unknown> | unknown;
}
