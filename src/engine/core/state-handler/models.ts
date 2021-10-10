export interface RawState<T extends object> {
  state: T;
  extensions: { [key: string]: object };
  entities: { [key: string]: RawEntitiesState<object> };
}

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
