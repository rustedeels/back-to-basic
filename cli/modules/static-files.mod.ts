import {
  fs,
  path,
} from '../_deps.ts';
import * as Console from '../utils/console.ts';
import { getProjectInfo } from './info.mod.ts';

export async function copyStaticFiles(log = false): Promise<void> {
  const info = await getProjectInfo();
  const dist = info.dist;
  const publicPath = info.public;

  await fs.ensureDir(dist);

  if (log) { Console.info('Copying static files...'); }

  const srcPart = '/public/';
  const cachePart = '/dist/';

  for await (const file of fs.walk(publicPath)) {
    if (!file.isFile) continue;

    const target = file.path
      .replace('\\public\\', '/public/')
      .replace(srcPart, cachePart);

    if (log) { Console.debug(`${file.path} -> ${target}`); }

    const dir = path.dirname(target);
    await fs.ensureDir(dir);

    await fs.copy(file.path, target, { overwrite: true });
  }
}

export async function runCopyStaticFiles(log = false): Promise<number> {
  try {
    await copyStaticFiles(log);
    return 0;
  } catch (err) {
    Console.error(err);
    return 1;
  }
}
