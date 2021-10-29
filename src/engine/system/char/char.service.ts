import {
  ensureStore,
  EntityStore,
  Injectable,
} from '/engine/core/index.js';

import { IActorProvider } from '../actor/model.js';
import {
  buildChar,
  CHAR_STORE_PATH,
  CHAR_TYPE,
  IChar,
  PLAYER_ID,
} from './model.js';

@Injectable()
export class CharService implements IActorProvider<string, IChar> {

  public readonly charStore: EntityStore<IChar, 'id'>;

  public get root(): boolean { return true; }
  public get targets(): string[] { return [CHAR_TYPE]; }

  constructor() {
    const initialPlayerState = buildChar(PLAYER_ID);
    this.charStore = ensureStore(CHAR_STORE_PATH, [initialPlayerState], 'id');
  }

  /** Create the character if needed */
  public async ensure(initial: Partial<IChar> & { id: string; }): Promise<IChar> {
    if (this.charStore.hasEntity(initial.id)) {
      const char = this.charStore.getEntity(initial.id);
      return { ...initial, ...char };
    }

    const char = buildChar(initial.id, initial);
    await this.charStore.upsert(char);
    return { ...initial, ...char };
  }

}
