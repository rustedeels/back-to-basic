import { runTypescript } from '../modules/tsc.mod.ts';
import { CliCommand } from './cli.model.ts';

export const TscCommand: CliCommand = {
  name: 'tsc',
  description: 'Run typescript transpiler',
  args: [],
  options: [],
  action: () => runTypescript(),
};
