import '/libs/Reflect.js';

import { ObjectOf } from '/engine/helpers/models.js';

import { isConstructor } from './guards.js';
import { appContainer as container } from './instance.js';
import {
  Token,
  TokenLife,
  Type,
} from './models.js';

/** Decorator to inject instances at runtime */
export function Inject<T>(token?: Token<T>): PropertyDecorator {
  return function(target: ObjectOf<unknown>, propKey: string | symbol): void {
    const instanceKey = Symbol(propKey.toString());

    Object.defineProperty(target, instanceKey, {
      writable: true,
      value: undefined
    });

    Object.defineProperty(target, propKey, {
      get() {
        const type = Reflect.getMetadata('design:type', target, propKey) as Type<T> | undefined;
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

/** Register class in app container */
export function Injectable(life: Exclude<TokenLife, 'value'> = 'singleton'): ClassDecorator {
  // eslint-disable-next-line @typescript-eslint/ban-types
  return (fn: Function) => {
    if (!isConstructor(fn)) return;
    container.register(fn, life);
  };
}
