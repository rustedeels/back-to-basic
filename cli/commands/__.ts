import { CacheCommand } from './cache.cmd.ts';
import { CliCommand } from './cli.model.ts';
import { DevServerCommand } from './dev-server.cmd.ts';
import { InfoCommand } from './info.cmd.ts';
import { SassCommand } from './sass.cmd.ts';
import { ServerCommand } from './server.cmd.ts';
import { StaticCommand } from './static-files.cmd.ts';
import { TscCommand } from './tsc.cmd.ts';

export const CliCommandMap: CliCommand[] = [
  InfoCommand,
  TscCommand,
  CacheCommand,
  SassCommand,
  StaticCommand,
  ServerCommand,
  DevServerCommand,
];
