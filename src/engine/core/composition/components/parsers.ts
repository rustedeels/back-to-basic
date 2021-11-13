import { AttrParser } from './models.js';

/** Evals value */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const EvalParser: AttrParser<any> = function (value: string | null): any {
  if (value === null) {
    return null;
  }
  try {
    const evalFunc = `(() => (${value}))()`;
    return eval(evalFunc);
  }
  catch (e) {
    throw new Error(`EvalParser: ${e}`);
  }
};
