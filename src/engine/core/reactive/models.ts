export interface Subscription {
  unsubscribe(): void;
  readonly active: boolean;
}

export interface Observer<T> {
  next(value: T): void;
  error(error: ObserverError): void;
  complete(): void;
}

export interface ObserverError {
  error: unknown;
  message: string;
}

export interface Observable<T> {
  subscribe(fn: (data: T) => void): Subscription;
  catchError(fn: (error: ObserverError) => void): Observable<T>;
}
