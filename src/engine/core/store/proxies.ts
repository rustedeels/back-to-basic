const ReadOnlyProxyHandler: ProxyHandler<object> = {
  set: (_, prop) => {
    throw new Error(`Cannot set ${String(prop)}, it's a readonly object`);
  }
};

export class Proxies {
  /** Make object readonly */
  public static readonly<T extends object>(entry: T): T {
    return new Proxy(entry, ReadOnlyProxyHandler) as T;
  }
}
