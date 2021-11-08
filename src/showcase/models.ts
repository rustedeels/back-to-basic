export interface IShowcase<T extends object> {
  name: string;
  category: string;
  htmlTag: string;
  description: string;
  classNames: { [key: string]: string };
  props: { [key in keyof T]?: IShowcaseProps }
  templates: IShowcaseTemplate[];
}

export interface IPartialShowcase<T extends object> {
  name?: string;
  category?: string;
  htmlTag?: string;
  description?: string;
  classNames?: { [key: string]: string };
  props?: { [key in keyof T]?: IPartialProps | string };
  templates?: IShowcaseTemplate[];
}

export interface IShowcaseProps {
  name: string;
  description: string;
  type: string;
  required: boolean;
  defaultValue: string;
}

export interface IPartialProps {
  name?: string;
  description?: string;
  type?: string;
  required?: boolean;
  defaultValue?: string;
}

export interface IShowcaseTemplate {
  name: string;
  description?: string;
  htmlSrc: string;
}
