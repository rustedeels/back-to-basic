import {
  appContainer,
  TypeResolver,
} from './engine/core/dependency-container/index.js';
import { Store } from './engine/core/store/index.js';
import { renderShowcases } from './showcase/index.js';

const store = new Store<{}>({});
appContainer.register(<TypeResolver<Store<{}>>>{
  target: Store,
  life: 'singleton',
  value: store
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(window as unknown as any)['$$STORE'] = store;

renderShowcases('app');
