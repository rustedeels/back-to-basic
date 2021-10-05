

import { getProjectInfo } from '../modules/info.mod.ts';
import { CliCommand } from './cli.model.ts';

export const InfoCommand: CliCommand = {
  name: 'info',
  description: 'Show info about current project',
  args: [],
  options: [],
  action,
};

async function action(): Promise<number> {
  const info = await getProjectInfo();
  console.log(info);
  return 0;
}
