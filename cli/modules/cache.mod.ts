import {
  fs,
  path,
} from '../_deps.ts';
import * as Console from '../utils/console.ts';
import { getProjectInfo } from './info.mod.ts';

/** Copy project sources to cache folder and replace imports with .ts */
export async function copySrcToCache(log = false) {
  const info = await getProjectInfo();
  const cache = info.cache;
  const src = info.src;

  await fs.ensureDir(cache);
  await fs.emptyDir(cache);

  const srcPart = '/src/';
  const cachePart = '/cli/.cache/';

  if (log) {
    Console.info(`Copying files from ${src} to ${cache}`);
  }

  for await (const file of fs.walk(src)) {
    if (!file.isFile) continue;
    if (file.path.includes('.spec.ts') || file.path.includes('tests')) continue;

    const target = file.path
      .replace('\\src\\', '/src/')
      .replace(srcPart, cachePart);

    if (log) {
      Console.debug(`${file.path} -> ${target}`);
    }

    const dir = path.dirname(target);
    await fs.ensureDir(dir);

    let content = await Deno.readTextFile(file.path);
    content = content.replaceAll('.js\'', '.ts\'');
    await Deno.writeTextFile(target, content);
  }
}

export async function runCache(log = false): Promise<number> {
  Console.info('Coping sources to cache forlder');
  try {
    await copySrcToCache(log);
    Console.success('Coping sources to cache forlder done');
    return 0;
  } catch (e) {
    Console.error(e);
    return 1;
  }
}
