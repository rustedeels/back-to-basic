import { buildShowcase } from '/showcase/index.js';

import { StoreInput } from './store-input.js';

buildShowcase<StoreInput<{}, never>>({
  description: 'Input element that binds to a store property',
  props: {
    type: 'Type of value: string or number',
    path: 'Path to the store',
    key: 'Key of the property',
    initValue: {
      description: 'Initial value of the store',
      type: 'Object'
    },
    placeholder: 'Placeholder text',
  },
  templates: [{
    name: 'String input',
    htmlSrc: '<sc-store-input label="Name" type="string" key="name" path="test-user" placeholder="Enter your name" />',
  }, {
    name: 'Number input',
    htmlSrc: '<sc-store-input label="Age" type="number" key="age" path="test-user" placeholder="Enter your Age"/>',
  }, {
    name: 'With initial state',
    htmlSrc: '<sc-store-input type="string" key="fullname" path="another-store" initValue="{ fullname:\'Rusted eels\' }" placeholder="Enter fullname"/>',
  }, {
    name: 'Disabled',
    htmlSrc: '<sc-store-input label="Super power" disabled="true" placeholder="Disable input" />',
  }]
}, StoreInput);
