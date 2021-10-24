/** Store JSON state */
export interface RawState<T extends object> {
  state: T;
  extensions: { [key: string]: object };
  entities: { [key: string]: RawEntitiesState<object> };
}

/** EntityStore JSON state */
export interface RawEntitiesState<T extends object> {
  idProp: keyof T;
  state: T[];
}

export type EntityStoreEventType = 'added' | 'removed' | 'updated';
export interface EntityStoreEvent<T extends object> {
  type: EntityStoreEventType;
  entity: T;
  state: T[];
}


/** EntityStore Path part */
export interface EntityStorePart {
  name: string;
  single: false;
}

/** Store path part from an EntityStore */
export interface EntityStoreSinglePart {
  name: string;
  single: true;
  id: string;
}

export type StorePart = string | EntityStorePart | EntityStoreSinglePart;

export type ParentStorePart = string | EntityStoreSinglePart;

interface FullPath {
  parents: ParentStorePart[];
}

/** Full path to an Extension store */
export interface ExtensionStorePath extends FullPath {
  value: string;
}

/** Full path to an EntityStore */
export interface EntityStorePath extends FullPath {
  value: EntityStorePart;
}

/** Full path to an Store from an EntityStore */
export interface EntityStoreSinglePath extends FullPath {
  value: EntityStoreSinglePart;
}

/** Full Path to a Store or EntityStore */
export type StorePath = ExtensionStorePath | EntityStorePath | EntityStoreSinglePath;

export function isEntityStorePart(path: StorePart): path is EntityStorePart {
  return (path as EntityStorePart).single === false;
}

export function isEntityStoreSinglePart(path: StorePart): path is EntityStoreSinglePart {
  return (path as EntityStoreSinglePart).single === true;
}

export interface AppState {
  version: string;
  lastUpdate: string;
  name: string;
}
