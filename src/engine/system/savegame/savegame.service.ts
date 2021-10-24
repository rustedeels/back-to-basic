import {
  AppState,
  EventsHandler,
  Inject,
  Injectable,
  Store,
} from '/engine/core/index.js';
import {
  ISavegame,
  ISaveState,
  PlatformService,
} from '/engine/platform/index.js';

import { SavegameEvents } from './models.js';

@Injectable()
export class SavegameService {

  @Inject()
  private readonly _platform!: PlatformService;

  @Inject()
  private readonly _store!: Store<AppState>;

  @Inject()
  public readonly events!: EventsHandler<SavegameEvents>;

  private get _saveEngine(): ISavegame {
    return this._platform.savegame;
  }

  /** List all available saves */
  public async list(): Promise<ISaveState[]> {
    return this._saveEngine.list();
  }

  /** Save state into a slot */
  public async save(slot: number, name: string): Promise<void> {
    const state = this._store.export();
    await this._saveEngine.save(slot, name, state);
    await this.events.emit('UserSave');
  }

  /** save to quicksave slot */
  public async quicksave(): Promise<void> {
    const state = this._store.export();
    await this._saveEngine.quicksave(state);
    await this.events.emit('Quicksave');
  }

  /** save to autosave slot */
  public async autosave(): Promise<void> {
    const state = this._store.export();
    await this._saveEngine.autosave(state);
    await this.events.emit('Autosave');
  }

  /** Load last quicksave */
  public async quickload(): Promise<void> {
    const list = await this.list();
    const quicksaves = list.filter(s => s.type === 'quicksave');

    let save = quicksaves.pop();
    if (!save) { throw new Error('No quicksave found'); }

    for (const s of quicksaves) {
      if (s.date > save.date) {
        save = s;
      }
    }

    const state = await this._saveEngine.load(save.slot);
    this._store.import(state);
    await this.events.emit('Quickload');
  }

  /** Load slot into state */
  public async load(slot: number): Promise<void> {
    const state = await this._saveEngine.load(slot);
    this._store.import(state);
    await this.events.emit('UserLoad');
  }

  /** Delete a save slot */
  public async delete(slot: number): Promise<void> {
    await this._saveEngine.delete(slot);
  }

  /** Load last save */
  public async loadLast(): Promise<void> {
    const list = await this.list();

    let save = list.pop();
    if (!save) { throw new Error('No savegame found'); }

    for (const s of list) {
      if (s.date > save.date) {
        save = s;
      }
    }

    await this.load(save.slot);
  }
}
