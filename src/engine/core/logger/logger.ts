import { Injectable } from '../dependency-container/index.js';
import { InternalLoggerEngine } from './engine.js';
import { isLogOptionExtra } from './guards.js';
import {
  LoggerEngine,
  LogLevel,
  LogOption,
  LogOptionExtra,
} from './models.js';

@Injectable()
export class LoggerService {
  private readonly _engines: LoggerEngine[] = [InternalLoggerEngine];
  public logLevel: number = LogLevel.all;

  public setLogLevel(v: number): void {
    this.logLevel = v;
  }

  public addEngine(engine: LoggerEngine): void {
    this._engines.push(engine);
  }

  public removeEngine(engine: LoggerEngine): void {
    const index = this._engines.indexOf(engine);
    if (index > -1) this._engines.splice(index, 1);
  }

  public startTimer(): string {
    const name = `Timer[${Math.random().toString()}]`;
    console.time(name);
    return name;
  }

  public stopTimer(v: string): void {
    console.timeEnd(v);
  }

  public error(message: string, extra: LogOptionExtra, ...params: unknown[]): Promise<void>;
  public error(message: string, ...params: unknown[]): Promise<void>;
  public error(message: string, ...restParams: unknown[]): Promise<void> {
    return this.LogOption(LogLevel.error, message, ...restParams);
  }

  public warning(message: string, extra: LogOptionExtra, ...params: unknown[]): Promise<void>;
  public warning(message: string, ...params: unknown[]): Promise<void>;
  public warning(message: string, ...restParams: unknown[]): Promise<void> {
    return this.LogOption(LogLevel.warning, message, ...restParams);
  }

  public info(message: string, extra: LogOptionExtra, ...params: unknown[]): Promise<void>;
  public info(message: string, ...params: unknown[]): Promise<void>;
  public info(message: string, ...restParams: unknown[]): Promise<void> {
    return this.LogOption(LogLevel.info, message, ...restParams);
  }

  public debug(message: string, extra: LogOptionExtra, ...params: unknown[]): Promise<void>;
  public debug(message: string, ...params: unknown[]): Promise<void>;
  public debug(message: string, ...restParams: unknown[]): Promise<void> {
    return this.LogOption(LogLevel.debug, message, ...restParams);
  }

  public engine(message: string, extra: LogOptionExtra, ...params: unknown[]): Promise<void>;
  public engine(message: string, ...params: unknown[]): Promise<void>;
  public engine(message: string, ...restParams: unknown[]): Promise<void> {
    const msg = `[BATATAS] ${message}`;
    return this.LogOption(LogLevel.engine, msg, ...restParams);
  }

  public LOG(opt: LogOption): Promise<void> {
    if (opt.assert || opt.level > this.logLevel) return Promise.resolve();

    // stop timer
    if(opt.timer) this.stopTimer(opt.timer);

    let params = [];

    if (opt.preserve) {
      for (const p of (opt.params ?? []))
        params.push(JSON.parse(JSON.stringify(p)));
    } else {
      params = opt?.params ?? [];
    }

    return this.writeLog(opt, params);
  }

  private async writeLog(opt: LogOption, params: unknown[]): Promise<void> {
    const l = opt.level;

    for (const e of this._engines) {
      if (l <= LogLevel.error) {
        await e.error(opt.message, ...params);
      } else if (l <= LogLevel.warning) {
        await e.warning(opt.message, ...params);
      } else if (l <= LogLevel.info) {
        await e.info(opt.message, ...params);
      } else if (l <= LogLevel.debug) {
        await e.debug(opt.message, ...params);
      } else if (l <= LogLevel.engine) {
        await e.engine(opt.message, ...params);
      } else {
        await e.default(opt.message, ...params);
      }
    }
  }

  private LogOption(level: number, message: string, ...restParams: unknown[]): Promise<void> {
    if (level > this.logLevel) return Promise.resolve();

    const o: LogOption = {
      level,
      message,
      params: restParams,
    };

    const op = restParams[0];
    if (isLogOptionExtra(op)) {
      o.params = restParams.slice(1);
      o.timer = op.$timer;
      o.assert = op.$assert;
      o.preserve = op.$preserve;
    }

    return this.LOG(o);
  }
}
