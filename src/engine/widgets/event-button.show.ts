import { buildShowcase } from '/showcase/index.js';

import { EventButton } from './event-button.js';

buildShowcase<EventButton>({
  category: 'Widgets',
  name: 'Event Button',
  description: 'A button that emits an event when clicked.',
  htmlTag: 'event-button',
  classNames: {},
  props: {
    text: {
      type: 'string',
      defaultValue: 'Button',
      description: 'The text to display on the button.',
      name: 'text',
      required: false,
    },
    event: {
      type: 'string',
      defaultValue: '',
      description: 'The event to emit when the button is clicked.',
      name: 'event',
      required: true,
    },
  }
});
