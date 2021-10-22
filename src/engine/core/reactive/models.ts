export interface Subscription {
  unsubscribe(): void;
  readonly active: boolean;
}

export interface Observer<T> {
  next(value: T): Promise<void>;
  error(error: ObserverError): void;
  complete(): void;
}

export interface ObserverError {
  error: unknown;
  message: string;
}

export interface Observable<T> {
  subscribe(fn: Listner<T>): Subscription;
  catchError(fn: (error: ObserverError) => unknown): Observable<T>;
}

export type Listner<T> =
  ((data: T) => (unknown | Promise<unknown>))
  | (() => (unknown | Promise<unknown>));
