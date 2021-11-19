import {
  fs,
  path,
} from '../_deps.ts';
import * as Console from '../utils/console.ts';
import { createDebounce } from '../utils/debounce.ts';
import { ensureAssetsSymlink } from './assets.mod.ts';
import { copySrcToCache } from './cache.mod.ts';
import { getProjectInfo } from './info.mod.ts';
import { ProjectInfo } from './models.ts';
import { compileSCSS } from './sass.mod.ts';
import {
  createServer,
  Server,
} from './server.mod.ts';
import { importShowcases } from './showcase.mod.ts';
import { copyStaticFiles } from './static-files.mod.ts';
import { importTests } from './tests-file.mod.ts';
import { transpileTypescript } from './tsc.mod.ts';

interface ActionErrors {
  static?: string;
  sass?: string;
  ts?: string;
}

type Info = ProjectInfo & { port: number };

function writeConsoleOutput(info: Info, errors: ActionErrors) {
  const hasErrors = Object.values(errors).some(v => v !== undefined);
  if (errors.static) {
    Console.error(`Error copying static files: ${errors.static}`);
  }
  if (errors.sass) {
    Console.error(`Error compiling sass: ${errors.sass}`);
  }
  if (errors.ts) {
    Console.error(`Error compiling typescript: ${errors.ts}`);
  }

  if (!hasErrors) { console.clear(); }
  else { Console.error('======================= End Errors ====================\n'); }
  Console.info(`Running from folder: ${path.basename(info.dist)}`);
  Console.warn('Listening on:\n');

  Console.success(`   Main: http://127.0.0.1:${info.port}`);
  Console.success(`   Demo: http://127.0.0.1:${info.port}/demo`);
  Console.success(`  Tests: http://127.0.0.1:${info.port}/tests`);

  Console.warn('\nTranspilation results:\n');

  if (errors.static) { Console.error('  static files: ERROR'); }
  else { Console.success('  Static files: OK'); }

  if (errors.sass) { Console.error('  Styles: ERROR'); }
  else { Console.success('  Styles: OK'); }

  if (errors.ts) { Console.error('  Typescript: ERROR\n'); }
  else { Console.success('  Typescript: OK\n'); }
}

async function watchStaticFiles(server: Server, info: Info, log: boolean) {
  const watcher = Deno.watchFs(info.public, { recursive: true });
  const run = createDebounce(300);

  for await (const e of watcher) {
    run(async () => {
      console.clear();
      Console.info(`Change detected in public files: ${e.paths}`);
      Console.warn('Coping static files...');
      try {
        await copyStaticFiles(log);
        writeConsoleOutput(info, {});
        server.reload();
      } catch (err) {
        writeConsoleOutput(info, {
          static: err,
        });
      }
    });
  }
}

async function watchSourceFiles(server: Server, info: Info, log: boolean) {
  const watcher = Deno.watchFs(info.src, { recursive: true });
  const run = createDebounce(300);

  for await (const e of watcher) {
    run(async () => {
      console.clear();
      Console.info(`Change detected in source files: ${e.paths}`);
      Console.warn('Transpiling typescript...');
      await copySrcToCache(log);
      const res = await transpileTypescript();
      writeConsoleOutput(info, {
        ts: res.success ? undefined : `Code ${res.code}`,
      });
      await importTests(info.dist, `${info.dist}/entry.tests.js`);
      await importShowcases(info.dist, `${info.dist}/entry.demo.js`);
      server.reload();
    });
  }
}

async function watchSASS(server: Server, info: Info) {
  const watcher = Deno.watchFs(info.styles, { recursive: true });
  const run = createDebounce(300);

  for await (const e of watcher) {
    run(async () => {
      console.clear();
      Console.info(`Change detected in style files: ${e.paths}`);
      Console.warn('Compiling styles...');
      const res = await compileSCSS(false);
      writeConsoleOutput(info, {
        sass: res.success ? undefined : `Code ${res.code}`,
      });
      server.styles();
    });
  }
}

export async function startDevelopmentServer(port: number, log: boolean): Promise<number> {
  const info = {
    ...await getProjectInfo(),
    port,
  };

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
  await importTests(info.dist, `${info.dist}/entry.tests.js`);
  await importShowcases(info.dist, `${info.dist}/entry.demo.js`);

  Console.info('Copying static files');
  await copyStaticFiles(log);

  Console.info('Creating assets Symlink');
  await ensureAssetsSymlink();

  try {
    const root = path.basename(info.dist);
    const server = createServer(root, port);

    watchStaticFiles(server, info, log);
    watchSourceFiles(server, info, log);
    watchSASS(server, info);

    writeConsoleOutput(info, {});

    await server.start();
    return 0;
  } catch (err) {
    Console.error(err);
    return 1;
  }
}
