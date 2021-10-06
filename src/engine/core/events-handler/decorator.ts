/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import '/libs/Reflect.js';

import { getRandomName } from '../../helpers/utils.js';
import {
  appContainer,
  isConstructor,
  Type,
} from '../dependency-container/index.js';
import { EventsHandler } from './handler.js';

/** Token for EventModule metadata */
export const EventModuleToken = Symbol('EventModule');

/** Load instance for EventModule type */
export function getEventModule<T>(target: Type<T>): T;
/** Load instance for EventModule type */
export function getEventModule<T extends object>(target: T): T;
/** Load instance for EventModule type */
export function getEventModule(target: any): any;
export function getEventModule<T>(target: Type<T>): T {
  const prototype = isConstructor(target) ? target.prototype : target;
  const name = Reflect.getMetadata(EventModuleToken, prototype);
  return appContainer.resolve<T>(name);
}

/** Register class as EventModule handler */
export function EventModule(target: Function): void {
  if (!isConstructor(target)) return;
  const name = Symbol.for(getRandomName());
  const instance = new target();
  appContainer.register(name, instance, 'value');
  Reflect.defineMetadata(EventModuleToken, name, target.prototype);
}

/** Trigger this method on event */
export function Event<T extends object>(event: Extract<keyof T, string>): MethodDecorator {
  return (target: any, key: string | symbol): void => {
    const eventsHandler = appContainer.resolve<EventsHandler<any>>(EventsHandler);
    eventsHandler.get(event).subscribe(data => {
      try {
        const instance = getEventModule(target);
        instance[key](data);
      } catch (err) {
        console.error('Error loading EventModule, make sure to add @EventModule', err);
      }
    });
  };
}
