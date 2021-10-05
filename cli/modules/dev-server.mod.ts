import {
  fs,
  path,
} from '../_deps.ts';
import * as Console from '../utils/console.ts';
import { createDebounce } from '../utils/debounce.ts';
import { copySrcToCache } from './cache.mod.ts';
import { getProjectInfo } from './info.mod.ts';
import { ProjectInfo } from './models.ts';
import { compileSCSS } from './sass.mod.ts';
import {
  createServer,
  Server,
} from './server.mod.ts';
import { copyStaticFiles } from './static-files.mod.ts';
import { importTests } from './tests-file.mod.ts';
import { transpileTypescript } from './tsc.mod.ts';

async function watchStaticFiles(server: Server, info: ProjectInfo, log: boolean) {
  const watcher = Deno.watchFs(info.public, { recursive: true });
  const run = createDebounce(300);

  for await (const e of watcher) {
    run(async () => {
      Console.info(`Change detected in public files: ${e.paths}`);
      await copyStaticFiles(log);
      server.reload();
    });
  }
}

async function watchSourceFiles(server: Server, info: ProjectInfo, log: boolean) {
  const watcher = Deno.watchFs(info.src, { recursive: true });
  const run = createDebounce(300);

  for await (const e of watcher) {
    run(async () => {
      Console.info(`Change detected in source files: ${e.paths}`);
      await copySrcToCache(log);
      const res = await transpileTypescript();
      if (!res.success) { Console.error('Error compiling typescript'); }
      await importTests(info.dist, `${info.dist}/run-tests.js`);
      server.reload();
    });
  }
}

async function watchSASS(server: Server, info: ProjectInfo) {
  const watcher = Deno.watchFs(info.styles, { recursive: true });
  const run = createDebounce(300);

  for await (const e of watcher) {
    run(async () => {
      Console.info(`Change detected in style files: ${e.paths}`);
      const res = await compileSCSS(false);
      if (!res.success) { Console.error('Error compiling sass'); }
      server.styles();
    });
  }
}

export async function startDevelopmentServer(port: number, log: boolean): Promise<number> {
  const info = await getProjectInfo();

  await fs.emptyDir(info.dist);

  Console.info('Updating cache');
  await copySrcToCache(log);

  Console.info('Compiling SCSS');
  let res = await compileSCSS(false);
  if (!res.success) {
    Console.error('Error compiling scss');
    return 1;
  }

  Console.info('Transpiling TypeScript');
  res = await transpileTypescript();
  if (!res.success) {
    Console.error('Error transpiling typescript');
    return 1;
  }
  await importTests(info.dist, `${info.dist}/run-tests.js`);

  Console.info('Copying static files');
  await copyStaticFiles(log);

  try {
    const root = path.basename(info.dist);
    Console.info(`Starting server in folder: ${root}`);
    const server = createServer(root, port);

    watchStaticFiles(server, info, log);
    watchSourceFiles(server, info, log);
    watchSASS(server, info);

    await server.start();
    return 0;
  } catch (err) {
    Console.error(err);
    return 1;
  }
}
