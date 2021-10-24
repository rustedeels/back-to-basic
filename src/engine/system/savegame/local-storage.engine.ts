import {
  AppState,
  RawState,
} from '/engine/core/index.js';
import { filterUndefined } from '/engine/helpers/utils.js';
import {
  ISavegame,
  ISaveState,
  SavegameOptions,
} from '/engine/platform/index.js';

type SaveState = {
  options: SavegameOptions;
  saves: { [key: number]: ISaveState | undefined; }
};

export class localStorageSavegameEngine implements ISavegame {
  private readonly _name = 'SAVE_GAME_ENGINE';
  /** Prefix to use */
  private readonly _prefix: string;
  /** Store state */
  private readonly _state: SaveState;

  private get _saveName(): string {
    return `${this._prefix}_${this._name}`;
  }

  public get options(): SavegameOptions {
    return this._state.options;
  }

  public constructor(prefix: string) {
    this._prefix = prefix;
    this._state = this.loadState();
  }

  public save(slot: number, name: string, state: RawState<AppState>): Promise<void> {
    this.internalSave(slot, name, state, 'save');
    return Promise.resolve();
  }

  public quicksave(state: RawState<AppState>): Promise<void> {
    const startSlot = 1000;
    const endSlot = startSlot + this._state.options.maxQuicksaveSlots;
    const quickSave = filterUndefined(Object.values(this._state.saves))
      .filter(s => s.type === 'quicksave');

    if (quickSave.length < this._state.options.maxQuicksaveSlots) {
      const slot = startSlot + quickSave.length;
      this.internalSave(slot, 'Quick Save', state, 'quicksave');
      return Promise.resolve();
    }

    let slot = startSlot;
    for (let i = slot; i < endSlot; i++) {
      const olderSave = this.getOlderSave(slot, i);
      if (olderSave) { slot = olderSave; }
    }

    this.internalSave(slot, 'Quick Save', state, 'quicksave');
    return Promise.resolve();
  }

  public autosave(state: RawState<AppState>): Promise<void> {
    const startSlot = 1000;
    const endSlot = startSlot + this._state.options.maxAutosaveSlots;
    const autosave = filterUndefined(Object.values(this._state.saves))
      .filter(s => s.type === 'autosave');

    if (autosave.length < this._state.options.maxAutosaveSlots) {
      const slot = startSlot + autosave.length;
      this.internalSave(slot, 'Autosave', state, 'autosave');
      return Promise.resolve();
    }

    let slot = startSlot;
    for (let i = slot; i < endSlot; i++) {
      const olderSave = this.getOlderSave(slot, i);
      if (olderSave) { slot = olderSave; }
    }

    this.internalSave(slot, 'Autosave', state, 'autosave');
    return Promise.resolve();
  }

  public load(slot: number): Promise<RawState<AppState>> {
    const jsonState = localStorage.getItem(this.getSlotName(slot));
    if (jsonState) {
      return Promise.resolve(JSON.parse(jsonState));
    }
    return Promise.reject(new Error('Save not found'));
  }

  public list(): Promise<ISaveState[]> {
    const allSaves = filterUndefined(Object.values(this._state.saves));
    const quicksave = allSaves.filter(s => s.type === 'quicksave');
    const autosave = allSaves.filter(s => s.type === 'autosave');
    const saves = allSaves.filter(s => s.type === 'save');

    if (quicksave.length > this._state.options.maxQuicksaveSlots) {
      quicksave.splice(this._state.options.maxQuicksaveSlots);
    }

    if (autosave.length > this._state.options.maxAutosaveSlots) {
      autosave.splice(this._state.options.maxAutosaveSlots);
    }

    if (saves.length > this._state.options.maxSlots) {
      saves.splice(this._state.options.maxSlots);
    }

    return Promise.resolve([...quicksave, ...autosave, ...saves]);
  }

  public delete(slot: number): Promise<void> {
    this._state.saves[slot] = undefined;
    this.saveState();
    localStorage.removeItem(this.getSlotName(slot));
    return Promise.resolve();
  }

  public setOptions(options: SavegameOptions): Promise<void> {
    this._state.options = options;
    this.saveState();
    return Promise.resolve();
  }

  private internalSave(
    slot: number,
    name: string,
    state: RawState<AppState>,
    type: 'save' | 'quicksave' | 'autosave'
  ): void {
    this._state.saves[slot] = {
      name,
      slot,
      type,
      date: new Date().getTime(),
    };
    this.saveState();
    localStorage.setItem(this.getSlotName(slot), JSON.stringify(state));
  }

  private getOlderSave(slot1: number, slot2: number): number | undefined {
    const save1 = this._state.saves[slot1];
    const save2 = this._state.saves[slot2];
    if (!save1 && !save2) { return undefined; }
    if (!save1) { return save2?.slot; }
    if (!save2) { return save1.slot; }

    if (save1.date < save2.date) {
      return save1.slot;
    }
    return save2.slot;
  }

  private getSlotName(slot: number): string {
    return `${this._saveName}_${slot}`;
  }

  private saveState(): void {
    localStorage.setItem(this._saveName, JSON.stringify(this._state));
  }

  private loadState(): SaveState {
    const state = localStorage.getItem(this._saveName);
    if (state) {
      return JSON.parse(state);
    }
    return this.createInitialState();
  }

  private createInitialState(): SaveState {
    return {
      options: {
        maxAutosaveSlots: 3,
        maxQuicksaveSlots: 5,
        maxSlots: 10,
      },
      saves: {},
    };
  }
}
