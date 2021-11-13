import {
  fs,
  path,
} from '../_deps.ts';
import * as Console from '../utils/console.ts';
import { getProjectInfo } from './info.mod.ts';

export async function ensureAssetsSymlink(): Promise<string> {
  const info = await getProjectInfo();

  const target = path.join(info.dist, 'assets');

  await fs.ensureSymlink(info.assets, target);
  return target;
}

export async function runEnsureAssetsSymlink(): Promise<number> {
  try {
    const target = await ensureAssetsSymlink();
    Console.info(`Symlink created: ${target}`);
    return 0;
  } catch (error) {
    Console.error(error);
    return 1;
  }
}
