import '/libs/Reflect.js';

import { isConstructor } from './guards.js';
import { appContainer as container } from './instance.js';
import {
  Token,
  Type,
} from './models.js';

export function Inject<T>(token?: Token<T>) {
  return function(target: any, propKey: string) {
    const instanceKey = Symbol(propKey.toString());

    Object.defineProperty(target, instanceKey, {
      writable: true,
      value: undefined
    });

    Object.defineProperty(target, propKey, {
      get() {
        const type = Reflect.getMetadata("design:type", target, propKey) as Type<T> | undefined;
        const key = token ?? type;

        if (typeof key !== 'symbol' && !isConstructor<T>(key)) {
          throw new Error(`Invalid token ${String(key)}`);
        }

        const life = container.has(key);
        if (!life) throw new Error(`No instance of ${key.toString()}`);

        let instance = this[instanceKey];
        if (!instance) {
          instance = this[instanceKey] = container.resolve(key);
        }
        return instance;
      },
      set() {
        throw new Error(`Cannot set ${propKey.toString()}, it's an injectable value`);
      }
    });
  };
}
