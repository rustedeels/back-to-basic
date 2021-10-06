import {
  Resolver,
  Type,
} from '../dependency-container/index.js';

export interface InitModule {
  /** Startup time */
  priority?: number;
  /** Dependencies to add to container */
  deps?: (Type<unknown> | Resolver<unknown>)[];
  /** Modules to initialize */
  mods?: (AppModule | Type<AppModule>)[];
  /** Run after startup */
  init?: () => void | Promise<void>;
}

export interface AppModule {
  init?: () => void | Promise<void>;
}

export enum InitPriority {
  /** Core modules and logic */
  Core = 0,

  /** Modules that are used by other modules */
  Default = 100,

  /** Modules that are used to render */
  Render = 1000,
}
