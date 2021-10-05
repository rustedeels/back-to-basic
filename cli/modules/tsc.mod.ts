import * as Console from '../utils/console.ts';
import { RunResult } from './models.ts';

export async function transpileTypescript(): Promise<RunResult> {
  const cmd = Deno.run({
    cmd: ['pwsh', '-c', 'yarn tsc'],
    cwd: Deno.cwd(),
  });

  const status = await cmd.status();

  return {
    success: status.success,
    code: status.code,
  };
}

export async function runTypescript(): Promise<number> {
  Console.info('Running typescript transpiler');
  try {
    const result = await transpileTypescript();
    if (result.success) {
      Console.success('Typescript transpiler ran successfully');
      return 0;
    } else {
      Console.error(`Typescript transpiler return error: ${result.code}`);
      return 1;
    }
  } catch (e: unknown) {
    Console.error(String(e));
    return 1;
  }
}
