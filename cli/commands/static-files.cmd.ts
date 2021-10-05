import { runCopyStaticFiles } from '../modules/static-files.mod.ts';
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

export const StaticCommand: CliCommand = {
  name: 'static',
  description: 'Copy static files to dist',
  args: [],
  options: [logOption],
  action: (_, opts) => runCopyStaticFiles(!!getOptionValue(opts, logOption)),
};
