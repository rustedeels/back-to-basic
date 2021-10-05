import {
  Resolver,
  Type,
} from '../dependency-container/index.js';

export interface InitModule {
  deps?: (Type<unknown> | Resolver<unknown>)[];
  priority?: number;
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
