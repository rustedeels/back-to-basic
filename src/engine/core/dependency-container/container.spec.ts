import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { Container } from './container.js';

class TestClass {
  private _name = '';

  public get name(): string {
    return this._name;
  }

  public set name(value: string) {
    this._name = value;
  }
}

describe('Dependency Container', () => {
  it('Should allow to store a constant value', () => {
    const container = new Container();

    const key = Symbol('key');
    const value = Symbol('value');

    container.register(key, value, 'value');

    const target = container.resolve(key);
    Assert.isEqual(target, value);
  });

  it('Should preserve values for singletons', () => {
    const container = new Container();
    container.register(TestClass);

    const target1 = container.resolve(TestClass);
    target1.name = 'test';
    const target2 = container.resolve(TestClass);
    Assert.isEqual(target2.name, 'test');
  });

  it('Should create a new instance for transient', () => {
    const container = new Container();
    container.register(TestClass, 'transient');

    const target1 = container.resolve(TestClass);
    target1.name = 'test';
    const target2 = container.resolve(TestClass);
    Assert.isNotEqual(target2.name, 'test');
  });
});
