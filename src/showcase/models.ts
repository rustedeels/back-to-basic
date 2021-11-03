export interface IShowcase<T extends object> {
  name: string;
  category: string;
  htmlTag: string;
  description: string;
  classNames: { [key: string]: string };
  props: { [key in keyof T]?: IShowcaseProps }
}

export interface IShowcaseProps {
  name: string;
  description: string;
  type: string;
  required: boolean;
  defaultValue: string;
}

export interface IShowcaseTemplate<T extends object> {
  name: string;
  description: string;
  values: { [key in keyof T]?: string }
  props: { [key in keyof T]?: T[key] }
}
