import { runServer } from '../modules/server.mod.ts';
import {
  CliCommand,
  CliOption,
  getOptionValue,
} from './cli.model.ts';

const portOption: CliOption<number> = {
  name: 'port',
  shortName: 'p',
  description: 'server port number',
  hasValue: true,
  required: false,
  defaultValue: 8080,
};

const folderOption: CliOption<string> = {
  name: 'folder',
  shortName: 'f',
  description: 'server folder',
  hasValue: true,
  required: false,
  defaultValue: 'dist',
};

export const ServerCommand: CliCommand = {
  name: 'serve',
  description: 'Copy static files to dist',
  args: [],
  options: [portOption, folderOption],
  action: (_, opts) => runServer(
    getOptionValue(opts, folderOption, 'dist'),
    getOptionValue(opts, portOption, 8080)
  ),
};
