import { runEnsureAssetsSymlink } from '../modules/assets.mod.ts';
import { CliCommand } from './cli.model.ts';

export const AssetsCommand: CliCommand = {
  name: 'assets',
  description: 'Create assets Symlink',
  args: [],
  options: [],
  action: () => runEnsureAssetsSymlink(),
};
