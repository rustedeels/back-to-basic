/* eslint-disable @typescript-eslint/no-explicit-any */
import { appContainer } from '../dependency-container/index.js';
import { LoggerService } from '../logger/index.js';
import { EntityStore } from './entity-store.js';
import {
  isEntityStorePart,
  ParentStorePart,
} from './models.js';
import { parseStorePath } from './store-path.js';
import { Store } from './store.js';

function loadParentStore<T extends object>(store: Store<T>, parents: ParentStorePart[]): Store<T> {
  const parentPart = parents.shift();

  if (!parentPart) {
    return store;
  }

  if (typeof parentPart === 'string') {
    return loadParentStore(store.extensions.get(parentPart), parents);
  } else {
    const entityStore = store.entities.getEntityStore(parentPart.name) as EntityStore<T, any>;
    const id = entityStore.tryParseId(parentPart.id);
    return loadParentStore(entityStore.getStore(id), parents);
  }
}

function ensureExtStore<T extends object>(parent: Store<T>, name: string, initialState?: T): Store<T> {
  if (parent.extensions.has(name)) {
    return parent.extensions.get(name) as Store<T>;
  }

  if (initialState) {
    return parent.extensions.set(name, initialState);
  }

  throw new Error(`Extension store for ${name} doesn't exist, ensure you are passing an initial state`);
}

function ensureEntityStore<T extends object>(parent: Store<T>, name: string, idProp?: any, initialState?: any): EntityStore<T, any> {
  if (parent.entities.hasEntityStore(name)) {
    return parent.entities.getEntityStore(name) as EntityStore<T, any>;
  }

  if (idProp) {
    return parent.entities.createEntityStore(name, idProp, initialState);
  }

  throw new Error(`Entity store for ${name} doesn't exist, ensure you are passing an initial state`);
}

function ensureEntityStoreForId<T extends object>(parent: Store<T>, name: string, id: any, idProp?: any, initialState?: any): Store<T> {
  const store = ensureEntityStore(parent, name, idProp);
  id = store.tryParseId(id);
  if (store.hasEntity(id)) {
    return store.getStore(id) as Store<T>;
  }

  if (!initialState) {
    throw new Error(`Entity with id ${id} doesn't exist in entity store ${name}, ensure you are passing an initial state`);
  }

  store.add(initialState);
  if (store.hasEntity(id)) {
    return store.getStore(id) as Store<T>;
  }

  throw new Error(`Entity with id ${id} doesn't exist in entity store ${name}, ensure you are passing an initial state`);
}

/** Return a store from passed path */
export function ensureStore<T extends object>(path: string): Store<T>;
/** Return a store from passed path, undefined if not found */
export function ensureStore<T extends object>(path: string, throws: false): Store<T> | undefined;
/** Return a store from passed path, trys to create one if not found */
export function ensureStore<T extends object>(path: string, initialState: T): Store<T>;
/** Return a store from passed path, trys to create one if not found */
export function ensureStore<T extends object>(path: string, initialState: T, throws: false): Store<T> | undefined;
/** Return a EntityStore from passed path */
export function ensureStore<T extends object, K extends keyof T>(path: string): EntityStore<T, K>;
/** Return a EntityStore from passed path, undefined if not found */
export function ensureStore<T extends object, K extends keyof T>(path: string, throws: false): EntityStore<T, K> | undefined;
/** Return a EntityStore from passed path, trys to create one if not found */
export function ensureStore<T extends object, K extends keyof T>(path: string, initialState: T[] | undefined, idProp: K): EntityStore<T, K>;
/** Return a EntityStore from passed path, trys to create one if not found */
export function ensureStore<T extends object, K extends keyof T>(path: string, initialState: T[] | undefined, idProp: K, throws: false): EntityStore<T, K> | undefined;
/** Return a Entity from an EntityStore from passed path, trys to create one if not found */
export function ensureStore<T extends object, K extends keyof T>(path: string, initialState: T, idProp: K): Store<T>;
/** Return a Entity from an EntityStore from passed path, trys to create one if not found */
export function ensureStore<T extends object, K extends keyof T>(path: string, initialState: T, idProp: K, throws: false): Store<T> | undefined;
/** Create a store, if required, and return it */
export function ensureStore<T extends object>(
  path: string,
  stateOrThrows?: any | boolean,
  idPropOrThrows?: any | boolean,
  throws = true
): Store<T> | EntityStore<T, any> | undefined {

  const shouldThrow = typeof stateOrThrows === 'boolean' ? stateOrThrows :
    (typeof idPropOrThrows === 'boolean' ? idPropOrThrows : throws);
  const initialState = typeof stateOrThrows === 'object' ? stateOrThrows : undefined;
  const key = typeof idPropOrThrows !== 'boolean' ? idPropOrThrows : undefined;

  try {
    const storePath = parseStorePath(path);
    const root = appContainer.resolve<Store<T>>(Store);

    const parent = loadParentStore(root, storePath.parents);
    if (typeof storePath.value === 'string') {
      return ensureExtStore(parent, storePath.value, initialState);
    } else if (isEntityStorePart(storePath.value)) {
      return ensureEntityStore(parent, storePath.value.name, key, initialState);
    } else {
      return ensureEntityStoreForId(parent, storePath.value.name, storePath.value.id, key, initialState);
    }
  } catch (e) {
    const logger = appContainer.resolve(LoggerService);

    if (shouldThrow) {
      logger.error(`Error finding store for path: ${path}`);
      throw e;
    }

    logger.warning(`Error finding store for path: ${path}`);
    return undefined;
  }
}
