import {
  EntityStorePart,
  EntityStoreSinglePart,
  isEntityStorePart,
  ParentStorePart,
  StorePart,
  StorePath,
} from './models.js';

const RegExpEntitySingle = /^(.+)\[([^\]]+)\]$/;
const RegExpEntityAll = /^(.+)\[\]$/;

function parseStorePart(part: string): StorePart {
  const e1 = parseEntityStorePart(part);
  if (e1) { return e1; }

  const e2 = parseEntitySingleStorePart(part);
  if (e2) { return e2; }

  return part;
}

function parseEntityStorePart(part: string): EntityStorePart | undefined {
  const execRes = RegExpEntityAll.exec(part);
  if (!execRes) { return undefined; }

  const [, name] = execRes;
  if (!name) { return undefined; }

  return { name, single: false };
}

function parseEntitySingleStorePart(part: string): EntityStoreSinglePart | undefined {
  const execRes = RegExpEntitySingle.exec(part);
  if (!execRes) { return undefined; }

  const [, name, id] = execRes;
  if (!name || !id) { return undefined; }

  return { name, id, single: true };
}

export function parseStorePath(path: string): StorePath {
  const parents = path.split('.').map(parseStorePart) as ParentStorePart[];
  const value = parents.pop();

  if (!value) { throw new Error(`Invalid store path: ${path}`); }

  if (parents.some(p => isEntityStorePart(p))) {
    throw new Error(`Invalid store path: ${path}, Can't have a child of a EntityStore[]`);
  }

  return { parents, value } as StorePath;
}
