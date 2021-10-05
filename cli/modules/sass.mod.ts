import * as Console from '../utils/console.ts';
import { RunResult } from './models.ts';

export async function compileSCSS(watch = false): Promise<RunResult> {
  const cmd = Deno.run({
    cmd: ['pwsh', '-c', `yarn node-sass -o ./dist ${watch ? '-w' : ''} ./styles/styles.scss`],
    cwd: Deno.cwd(),
  });

  if (watch) {
    Console.info('Watching for style changes...');
  }

  const status = await cmd.status();

  return {
    success: status.success,
    code: status.code,
  };
}

export async function runCompileSCSS(): Promise<number> {
  Console.info('Running sass compiler');
  try {
    const result = await compileSCSS();
    if (result.success) {
      Console.success('Sass compiler ran successfully');
      return 0;
    } else {
      Console.error(`Sass compiler return error: ${result.code}`);
      return 1;
    }
  } catch (e: unknown) {
    Console.error(String(e));
    return 1;
  }
}
