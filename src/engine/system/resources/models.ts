export interface Resource {
  id: string;
  tags: string[];
  type: string;
  path: string;
}

export interface ResourceEvents {
  ResourcesAdded: Resource[];
  ResourcesRemoved: Resource[];
}
