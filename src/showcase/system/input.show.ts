import { buildShowcase } from '../index.js';

buildShowcase<HTMLInputElement>({
  name: 'Input',
  category: 'System',
  description: 'The input element.',
  htmlTag: 'input',
  classNames: {},
  props: {
    type: {
      defaultValue: 'text',
      description: 'The type of the input element.',
      name: 'type',
      type: 'string',
      required: false,
    }
  }
});
