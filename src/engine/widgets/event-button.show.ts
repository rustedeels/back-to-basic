import { buildShowcase } from '/showcase/index.js';

import { appContainer } from '../core/dependency-container/index.js';
import { EventsHandler } from '../core/events-handler/index.js';
import { EventButton } from './event-button.js';

buildShowcase<EventButton>({
  description: 'A button that emits an event when clicked.',
  props: {
    text: 'The text to display on the button.',
    event: 'The event to emit when the button is clicked.',
    disabled: 'Whether the button is disabled.',
  },
  templates: [{
    name: 'Default button',
    htmlSrc: '<sc-event-button text="Show Alert" event="showAlertEventEventButton" />',
    description: 'A button that emits an event when clicked.',
  }, {
    name: 'Disabled button',
    htmlSrc: '<sc-event-button text="Disabled text" event="showAlertEventEventButton" disabled="true" />',
  }]
}, EventButton, () => {
  appContainer
    .resolve(EventsHandler)
    .get('showAlertEventEventButton' as never)
    .subscribe(() => alert('Button clicked!'));
});
