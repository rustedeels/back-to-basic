import { IActor } from '../actor/model.js';

export interface Resource extends IActor<string> {
  id: string;
  tags: string[];
  path: string;
}

export interface ResourceEvents {
  ResourcesAdded: Resource[];
  ResourcesRemoved: Resource[];
}
