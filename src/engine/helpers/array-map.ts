/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
export class ArrayMap<TKey, TValue> implements Map<TKey, TValue[]> {
  private readonly _map: Map<TKey, TValue[]>;

  public constructor(interable?: Iterable<[TKey, TValue[]]>) {
    if (interable) {
      this._map = new Map(interable);
    } else {
      this._map = new Map();
    }
  }

  [Symbol.toStringTag]: string;

  public get size(): number {
    return this._map.size;
  }

  public has(key: TKey): boolean {
    return this._map.has(key);
  }

  public get(key: TKey): TValue[] {
    return this._map.get(key) ?? [];
  }

  public first(key: TKey): TValue | undefined {
    return this.get(key)[0];
  }

  public addUnique(key: TKey, ...values: TValue[]): this {
    const v = this.get(key);
    const newValues = [...new Set([...v, ...values])];
    this.set(key, newValues);
    return this;
  }

  public add(key: TKey, ...values: TValue[]): this {
    this._map.set(key, [...this.get(key), ...values]);
    return this;
  }

  public set(key: TKey, value: TValue): this
  public set(key: TKey, value: TValue[]): this
  public set(key: TKey, value: TValue[] | TValue): this {
    const v = Array.isArray(value) ? value : [value];
    this._map.set(key, v);
    return this;
  }

  public delete(key: TKey): boolean {
    return this._map.delete(key);
  }

  public filter(key: TKey, fn: (v: TValue) => boolean): this {
    const values = this.get(key);
    const newValues = values.filter(fn);
    this.set(key, newValues);
    return this;
  }

  public clear(): void {
    this._map.clear();
  }

  public [Symbol.iterator](): IterableIterator<[TKey, TValue[]]> {
    return this._map[Symbol.iterator]();
  }

  public entries(): IterableIterator<[TKey, TValue[]]> {
    return this._map.entries();
  }

  public keys(): IterableIterator<TKey> {
    return this._map.keys();
  }

  public values(): IterableIterator<TValue[]> {
    return this._map.values();
  }

  public flat(): TValue[] {
    return [...this.values()].flat();
  }

  public toArray(): [TKey, TValue[]][] {
    return [...this.entries()];
  }

  public forEach(callbackfn: (value: TValue[], key: TKey, map: Map<TKey, TValue[]>) => void, thisArg?: any): void {
    this._map.forEach((v, k) => callbackfn(v, k, thisArg));
  }
}
