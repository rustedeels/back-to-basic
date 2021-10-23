export class Mock<T extends object> {
  private _value: Partial<T> = {};

  public setup<K extends keyof T>(key: K, value: T[K]): Mock<T> {
    this._value[key] = value;
    return this;
  }

  public setupAll(values: Partial<T>): Mock<T> {
    this._value = { ...this._value, ...values };
    return this;
  }

  public get value(): T {
    return this._value as T;
  }
}
