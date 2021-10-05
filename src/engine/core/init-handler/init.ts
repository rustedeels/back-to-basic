import {
  appContainer,
  isConstructor,
  Type,
} from '../dependency-container/index.js';
import {
  InitModule,
  InitPriority,
} from './models.js';

export class InitHandler {
  private _hasInit = false;
  private readonly _modules = new Map<number, InitModule[]>();

  public addModule(module: InitModule | Type<InitModule>): void {
    const mod = isConstructor(module) ? new module() : module;
    const priority = mod.priority ?? InitPriority.Default;
    this._modules.set(priority, [...this.getByPriotiy(priority), mod]);
  }

  public async init(): Promise<void> {
    if (this._hasInit) {
      throw new Error('InitHandler has already been initialized');
    }

    await this.applyByOrder(m => {
      for (const d of m.deps ?? []) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        appContainer.register(d as any);
      }
    });

    await this.applyByOrder(async m => {
      try {
        if(m.init) await m.init();
      } catch (e) {
        console.error('Error runnning init:', e);
      }
    });

    this._hasInit = true;
  }

  private getByPriotiy(priority: number): InitModule[] {
    if (!this._modules.has(priority)) {
      this._modules.set(priority, []);
    }

    return this._modules.get(priority) as InitModule[];
  }

  private async applyByOrder(func: (m: InitModule) => void | Promise<void>): Promise<void> {
    const pKeys = [...this._modules.keys()].sort((a, b) => a - b);
    for (const p of pKeys) {
      for (const m of this.getByPriotiy(p)) {
        await func(m);
      }
    }
  }
}

const initHandler = new InitHandler();
export { initHandler };
