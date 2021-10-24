import {
  AppState,
  RawState,
} from '/engine/core/index.js';

export interface ISaveState {
  slot: number;
  name: string;
  date: number;
  type: 'autosave' | 'save' | 'quicksave';
}

export interface SavegameOptions {
  /** Number of slots available to save */
  maxSlots: number;
  /** Number of quick saves to keep */
  maxQuicksaveSlots: number;
  /** Number of auto saves to keep */
  maxAutosaveSlots: number;
}

export interface ISavegame {
  list(): Promise<ISaveState[]>;
  load(slot: number): Promise<RawState<AppState>>;
  save(slot: number, name: string, state: RawState<AppState>): Promise<void>;
  delete(slot: number): Promise<void>;
  quicksave(state: RawState<AppState>): Promise<void>;
  autosave(state: RawState<AppState>): Promise<void>;
  setOptions(options: SavegameOptions): void;
  readonly options: SavegameOptions;
}
