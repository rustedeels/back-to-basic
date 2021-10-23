import { appContainer } from '/engine/core/index.js';
import {
  IFileSystem,
  PathEntry,
  PlatformService,
} from '/engine/platform/index.js';
import {
  Assert,
  describe,
  it,
  Mock,
} from '/tests/index.js';

import { Resource } from './models.js';
import { ResourcesService } from './resources.service.js';

function mockFileSystem(state: Partial<IFileSystem>): ResourcesService {
  const mockFS = new Mock<IFileSystem>()
    .setupAll(defaultFileSystem())
    .setupAll(state).value;
  const platform = appContainer.resolve(PlatformService);
  platform.initialize({ fileSystem: mockFS });
  return appContainer.resolve(ResourcesService);
}

function defaultFileSystem(): Partial<IFileSystem> {
  return {
    getPath(path: string): Promise<PathEntry> {
      return Promise.resolve({
        exists: path.startsWith('/'),
        isDirectory: false,
        path,
      });
    },
    mapToWebPath(path: string): Promise<string> {
      return Promise.resolve(`web:${path}`);
    }
  };
}

describe('ResourcesService', () => {
  it('should be instance of ResourceService', () => {
    const service = appContainer.resolve(ResourcesService);
    Assert.isTrue(service instanceof ResourcesService);
  });

  it('should add resource', async () => {
    const service = mockFileSystem({});
    const res: Resource[] = [{
      id: '1',
      path: '/path/1',
      type: 'type1',
      tags: ['tag1', 'tag2'],
    }, {
      id: '2',
      path: '/path/2',
      type: 'type2',
      tags: ['tag3', 'tag4'],
    }];

    service.clear();
    const added = await service.add(...res);

    Assert.isEqual(service.getAll().length, 2);
    Assert.isEqual(added.length, 2);

    const res1 = service.get('1');
    Assert.isNotUndefined(res1);
    Assert.isEqual(res1.id, '1');
    Assert.isEqual(res1.path, 'web:/path/1');
    Assert.isEqual(res1.type, 'type1');
    Assert.isEqual(res1.tags.length, 2);
    Assert.isEqual(res1.tags[0], 'tag1');
    Assert.isEqual(res1.tags[1], 'tag2');

    const res2 = service.get('2');
    Assert.isNotUndefined(res2);
    Assert.isEqual(res2.id, '2');
    Assert.isEqual(res2.path, 'web:/path/2');
    Assert.isEqual(res2.type, 'type2');
    Assert.isEqual(res2.tags.length, 2);
    Assert.isEqual(res2.tags[0], 'tag3');
    Assert.isEqual(res2.tags[1], 'tag4');
  });

  it('should remove resource', async () => {
    const service = mockFileSystem({});
    const res: Resource[] = [{
      id: '1',
      path: '/path/1',
      type: 'type1',
      tags: ['tag1', 'tag2'],
    }, {
      id: '2',
      path: '/path/2',
      type: 'type2',
      tags: ['tag3', 'tag4'],
    }];

    await service.clear();
    await service.add(...res);

    Assert.isEqual(service.getAll().length, 2);

    const removed = await service.remove('1');
    Assert.isEqual(removed.length, 1);
    Assert.isEqual(removed[0]?.id, '1');
    Assert.isEqual(service.getAll().length, 1);

    const res1 = service.get('1');
    Assert.isUndefined(res1);
  });

  it('should not add invalid paths', async () => {
    const service = mockFileSystem({});
    const res: Resource[] = [{
      id: '1',
      path: '/path/1',
      type: 'type1',
      tags: ['tag1', 'tag2'],
    }, {
      id: '2',
      path: '/path/2',
      type: 'type2',
      tags: ['tag3', 'tag4'],
    }];

    service.clear();
    await service.add(...res);

    Assert.isEqual(service.getAll().length, 2);

    const added = await service.add({
      id: '3',
      path: 'invalid/path/3',
      type: 'type3',
      tags: ['tag5', 'tag6'],
    });
    Assert.isEqual(added.length, 0);
    Assert.isEqual(service.getAll().length, 2);
  });

  it('should emit event on add', async () => {
    const service = mockFileSystem({});
    let addCount = 0;
    const res: Resource[] = [{
      id: '1',
      path: '/path/1',
      type: 'type1',
      tags: ['tag1', 'tag2'],
    }, {
      id: '2',
      path: '/path/2',
      type: 'type2',
      tags: ['tag3', 'tag4'],
    }];

    service.clear();

    service.events.get('ResourcesAdded')
      .subscribe(added => addCount = added?.length ?? 0);
    await service.add(true, ...res);

    Assert.isEqual(addCount, 2);
  });

  it('should emit event on remove', async () => {
    const service = mockFileSystem({});
    let removeCount = 0;
    const res: Resource[] = [{
      id: '1',
      path: '/path/1',
      type: 'type1',
      tags: ['tag1', 'tag2'],
    }, {
      id: '2',
      path: '/path/2',
      type: 'type2',
      tags: ['tag3', 'tag4'],
    }];

    service.clear();
    await service.add(...res);

    service.events.get('ResourcesRemoved')
      .subscribe(removed => removeCount = removed?.length ?? 0);
    await service.remove(true, '1');

    Assert.isEqual(removeCount, 1);
  });
});
