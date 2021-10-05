import { runCompileSCSS } from '../modules/sass.mod.ts';
import { CliCommand } from './cli.model.ts';

export const SassCommand: CliCommand = {
  name: 'sass',
  description: 'Run sass transpiler',
  args: [],
  options: [],
  action: () => runCompileSCSS(),
};
