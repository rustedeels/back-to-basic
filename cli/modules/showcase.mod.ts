import {
  fs,
  path,
} from '../_deps.ts';

export async function searchForShowcases(root: string): Promise<string[]> {
  // clean path
  root = path.join(root);
  const res: string[] = [];

  for await (const e of fs.walk(root, { includeDirs: false })) {
    if (e.isFile && e.name.endsWith('.show.js')) {
      res.push(e.path
        .replace(root, '')
        .replaceAll('\\', '/')
      );
    }
  }

  return res;
}

export async function importShowcases(root: string, file: string): Promise<void> {
  const entryContent = await Deno.readTextFile(file);
  const paths = await searchForShowcases(root);
  const imports = paths.map((path) => `import '${path}';`);
  const content = `${imports.join('\n')}\n\n${entryContent}`;
  await Deno.writeTextFile(file, content);
}
