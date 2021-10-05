import {
  fs,
  path,
} from '../_deps.ts';

export async function searchForTests(root: string): Promise<string[]> {
  // clean path
  root = path.join(root);
  const res: string[] = [];

  for await (const e of fs.walk(root, { includeDirs: false })) {
    if (e.isFile && e.name.endsWith('.spec.js')) {
      res.push(e.path
        .replace(root, '')
        .replaceAll('\\', '/')
      );
    }
  }

  return res;
}

export async function importTests(root: string, file: string): Promise<void> {
  const testContent = await Deno.readTextFile(file);
  const paths = await searchForTests(root);
  const imports = paths.map((path) => `import '${path}';`);
  const content = `${imports.join('\n')}\n\n${testContent}`;
  await Deno.writeTextFile(file, content);
}
