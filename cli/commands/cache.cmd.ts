import { runCache } from '../modules/cache.mod.ts';
import {
  CliCommand,
  CliOption,
  getOptionValue,
} from './cli.model.ts';

const logOption : CliOption<boolean> = {
  name: 'verbose',
  shortName: 'v',
  description: 'Log each file',
  hasValue: false,
  required: false,
  defaultValue: false,
};

export const CacheCommand: CliCommand = {
  name: 'cache',
  description: 'Cache source for deno imports',
  args: [],
  options: [logOption],
  action: (_, opts) => runCache(!!getOptionValue(opts, logOption)),
};
