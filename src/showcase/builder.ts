import { getAttribute } from '/engine/core/composition/components/attr.utils.js';
import { Type } from '/engine/helpers/util-types.js';

import {
  IPartialProps,
  IPartialShowcase,
  IShowcase,
  IShowcaseProps,
} from './models.js';

function buildFromProp<T extends object>(key: Extract<keyof T, string>, prop?: IPartialProps | string, target?: Type<T>): IShowcaseProps {
  if (!prop) { throw new Error('prop is undefined'); }

  if (typeof prop === 'string') {
    prop = {
      description: prop,
    } as IPartialProps;
  }

  if (target) {
    const opt = getAttribute<T, string>(target, key);
    if (opt) {
      prop.defaultValue = String(opt.default ?? prop.defaultValue ?? '');
      prop.required = opt.required ?? prop.required;
      prop.type = typeof (opt.type(opt.default) ?? undefined);
    }
  }

  return {
    name: key,
    defaultValue: prop?.defaultValue ?? '',
    description: prop?.description ?? '',
    type: prop?.type ?? 'string',
    required: prop?.required ?? false,
  };
}

function buildPartialProps<T extends object>(
  props?: { [key in keyof T]?: IPartialProps | string },
  target?: Type<T>
): { [key in keyof T]?: IShowcaseProps } {
  if (!props) { return {}; }

  const partialProps: { [key in keyof T]?: IShowcaseProps } = {};
  for (const key in props) {
    partialProps[key] = buildFromProp(key, props[key], target);
  }
  return partialProps;
}

export function buildFromPartialShowcase<T extends object>(showcase: IPartialShowcase<T>, target?: Type<T>): IShowcase<T> {
  return {
    category: 'default',
    classNames: {},
    description: '',
    htmlTag: '',
    name: '',
    templates: [],
    ...showcase,
    props: buildPartialProps(showcase.props, target)
  };
}
