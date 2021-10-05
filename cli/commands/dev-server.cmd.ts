import { startDevelopmentServer } from '../modules/dev-server.mod.ts';
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

const portOption: CliOption<number> = {
  name: 'port',
  shortName: 'p',
  description: 'server port number',
  hasValue: true,
  required: false,
  defaultValue: 8080,
};

export const DevServerCommand: CliCommand = {
  name: 'start',
  description: 'Start development server for app',
  args: [],
  options: [logOption, portOption],
  action: (_, opts) => startDevelopmentServer(
    getOptionValue(opts, portOption, 8080),
    getOptionValue(opts, logOption, true),
  ),
};
