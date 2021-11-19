import { initGameEngine } from './init/index.js';

export async function startGame(): Promise<void> {
  await initGameEngine();
}
