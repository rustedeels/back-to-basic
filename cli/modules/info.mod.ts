import { ProjectInfo } from './models.ts';

// deno-lint-ignore require-await
export async function getProjectInfo(): Promise<ProjectInfo> {
  const cwd = Deno.cwd();
  const cache = `${cwd}/cli/.cache`;
  const src = `${cwd}/src`;
  const dist = `${cwd}/dist`;
  const styles = `${cwd}/styles`;
  const publicPath = `${cwd}/public`;
  const assets = `${cwd}/assets`;

  return {
    cwd,
    cache,
    src,
    dist,
    styles,
    public: publicPath,
    assets,
  };
}
