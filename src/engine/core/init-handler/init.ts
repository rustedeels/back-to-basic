import {
  appContainer,
  isConstructor,
  Type,
} from '../dependency-container/index.js';
import {
  AppModule,
  InitModule,
  InitPriority,
} from './models.js';

/** Handles modules initialization */
export class InitHandler {
  private _hasInit = false;
  private readonly _initModules = new Map<number, InitModule[]>();
  private readonly _appModules = new Set<AppModule>();

  /** Add new Module */
  public addModule(module: InitModule | Type<InitModule>): void {
    const mod = isConstructor(module) ? new module() : module;
    const priority = mod.priority ?? InitPriority.Default;
    this._initModules.set(priority, [...this.getByPriotiy(priority), mod]);
  }

  /** Initialize all modules */
  public async init(): Promise<void> {
    if (this._hasInit) {
      throw new Error('InitHandler has already been initialized');
    }
    this._hasInit = true;

    // Add dependencies to container
    await this.applyByOrder(m => {
      for (const d of m.deps ?? []) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        appContainer.register(d as any);
      }
    });

    // Initialize modules
    await this.applyByOrder(async m => {
      try {
        if(m.init) await m.init();
        for (const module of m.mods ?? []) {
          await this.initAppModule(module);
        }
      } catch (e) {
        console.error('Error runnning init:', e);
      }
    });
  }

  /** Lazy load a single init module */
  public async lazyLoadModule(module: InitModule | Type<InitModule>): Promise<void> {
    if (!this._hasInit) throw new Error('InitHandler has not been initialized');

    const mod = isConstructor(module) ? new module() : module;
    if (mod.init) {
      await mod.init();
      for (const m of mod.mods ?? []) {
        await this.initAppModule(m);
      }
    }
  }

  private getByPriotiy(priority: number): InitModule[] {
    if (!this._initModules.has(priority)) {
      this._initModules.set(priority, []);
    }

    return this._initModules.get(priority) as InitModule[];
  }

  private async applyByOrder(func: (m: InitModule) => void | Promise<void>): Promise<void> {
    const pKeys = [...this._initModules.keys()].sort((a, b) => a - b);
    for (const p of pKeys) {
      for (const m of this.getByPriotiy(p)) {
        await func(m);
      }
    }
  }

  private async initAppModule(module: AppModule | Type<AppModule>): Promise<void> {
    const mod = isConstructor(module) ? new module() : module;
    if (mod.init) { await mod.init(); }
    this._appModules.add(mod);
  }
}

const initHandler = new InitHandler();
export { initHandler };
