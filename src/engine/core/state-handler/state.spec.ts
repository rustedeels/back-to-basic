import {
  Assert,
  describe,
  it,
} from '/tests/index.js';

import { Store } from './store.js';

interface Person {
  name: string;
  age: number;
}

interface Education {
  school: string;
  degree: string;
}

describe('Store', () => {
  it('State should be readonly', () => {
    const store = new Store<Person>({
      name: 'John',
      age: 30,
    });

    Assert.throws(() => {
      store.state.name = 'Jane';
    });
  });

  it('Should be able to update state', () => {
    const store = new Store<Person>({
      name: 'John',
      age: 30,
    });

    store.update({
      name: 'Jane',
      age: 31,
    });

    Assert.isEqual(store.state.name, 'Jane');
    Assert.isEqual(store.state.age, 31);
  });

  it('Should be able to update a property', () => {
    const store = new Store<Person>({
      name: 'John',
      age: 30,
    });

    store.updateProp('name', 'Jane');

    Assert.isEqual(store.state.name, 'Jane');
  });

  it('Should be able to extend', () => {
    const target = 'Education';
    const store = new Store<Person>({
      name: 'John',
      age: 30,
    });

    const extStore = store.extend<Education>(target, {
      school: 'MIT',
      degree: 'Masters',
    });

    Assert.isEqual(extStore.state.school, 'MIT');
    Assert.isEqual(extStore.state.degree, 'Masters');

  });

  it('Should be able to update extension', () => {
    const target = 'Education';
    const store = new Store<Person>({
      name: 'John',
      age: 30,
    });

    const extStore = store.extend<Education>(target, {
      school: 'MIT',
      degree: 'Masters',
    });

    extStore.update({
      school: 'Harvard',
      degree: 'Bachelors',
    });

    Assert.isEqual(store.extend<Education>(target).state.school, 'Harvard');
    Assert.isEqual(store.extend<Education>(target).state.degree, 'Bachelors');
  });
});
