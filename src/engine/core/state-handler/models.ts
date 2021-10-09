export interface RawState<T> {
  state: T;
  extensions: { [key: string]: object };
}
