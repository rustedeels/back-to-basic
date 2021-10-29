import { IActor } from '../actor/model.js';

export const CHAR_TYPE = 'CHARACTER';
export const CHAR_STORE_PATH = '$characters';
export const PLAYER_ID = '#player';

export interface IChar extends IActor<string> {
  name: string;
  portrait?: string;
  type: typeof CHAR_TYPE;
}

export function buildChar(id: string, state?: Partial<IChar>): IChar {
  return {
    id,
    type: CHAR_TYPE,
    name: state?.name ?? '',
    portrait: state?.portrait,
  };
}
