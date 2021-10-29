/** Base actor */
export interface IActor<T> {
  get type(): string;
  get id(): T;
}

/** Provider to create an actor */
export interface IActorProvider<K, T extends IActor<K>> {
  /** Should be the first to be called */
  get root(): boolean;
  /** Target actor types to target */
  get targets(): string[];
  /** Create or update the required fields */
  ensure(initial: Partial<T> & { id: K }): Promise<T>;
}
