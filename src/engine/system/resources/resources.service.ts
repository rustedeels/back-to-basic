import {
  EventsHandler,
  Inject,
  Injectable,
  LoggerService,
} from '/engine/core/index.js';
import { PlatformService } from '/engine/platform/index.js';

import {
  Resource,
  ResourceEvents,
} from './models.js';

@Injectable()
export class ResourcesService {
  private readonly resources = new Map<string, Resource>();

  @Inject()
  public events!: EventsHandler<ResourceEvents>;

  @Inject()
  protected _platform!: PlatformService;

  @Inject()
  protected _logger!: LoggerService;

  /**
   * Add new resources to library
   * @param waitForEvents wait for add event listeners to be called
   * @param resources resources to add
   */
  public add(waitForEvents: boolean, ...resources: Resource[]): Promise<Resource[]>;
  /** Add resources */
  public add(...resources: Resource[]): Promise<Resource[]>;
  public async add(waitOrRes: boolean | Resource, ...resources: Resource[]): Promise<Resource[]> {
    const wait = typeof waitOrRes === 'boolean' ? waitOrRes : false;
    const res = typeof waitOrRes === 'boolean' ? resources : [waitOrRes, ...resources];

    const added: Resource[] = [];

    for (const r of res) {
      const add = await this.addResource(r);
      if (add) { added.push(r); }
    }

    if (added.length) {
      if (wait) { await this.events.emit('ResourcesAdded', added); }
      else { this.events.emit('ResourcesAdded', added); }
    }

    return added;
  }

  /** Remove resources by id from library */
  public remove(...resources: string[]): Promise<Resource[]>
  /**
   * Remove resources from library
   * @param waitForEvents wait for remove event listeners to be called
   * @param resources resources ids to remove
   */
  public remove(waitForEvents: boolean, ...resources: string[]): Promise<Resource[]>
  public async remove(waitOrId: boolean | string, ...resources: string[]): Promise<Resource[]> {
    const wait = typeof waitOrId === 'boolean' ? waitOrId : false;
    const res = typeof waitOrId === 'boolean' ? resources : [waitOrId, ...resources];

    if (!res.length) { return []; }
    const deleted: Resource[] = [];

    for (const r of res) {
      const resource = this.resources.get(r);
      if (resource) {
        deleted.push(resource);
        this.resources.delete(r);
      }
    }

    if (deleted.length) {
      if (wait) { await this.events.emit('ResourcesRemoved', deleted); }
      else { this.events.emit('ResourcesRemoved', deleted); }
    }

    return deleted;
  }

  public clear(): Promise<void> {
    const curentResources = this.getAll();
    this.resources.clear();
    return this.events.emit('ResourcesRemoved', curentResources);
  }

  /** Get resource by id */
  public get(id: string): Resource | undefined {
    return this.resources.get(id);
  }

  /** Get all resources */
  public getAll(): Resource[] {
    return [...this.resources.values()];
  }

  /** Search for resources at least one of the tags */
  public searchAnyTag(...tags: string[]): Resource[] {
    tags = tags.map((t) => t.toLowerCase());
    return this.getAll()
      .filter((r) => r.tags.some(
        (t) => tags.includes(t)));
  }

  /** Search for resources with all tags */
  public searchAllTags(...tags: string[]): Resource[] {
    tags = tags.map((t) => t.toLowerCase());
    return this.getAll()
      .filter((r) => tags.every(
        t => r.tags.includes(t)));
  }

  /** Ensure resource was a valid path and add it to library */
  private async addResource(res: Resource): Promise<boolean> {
    const file = await this._platform.fileSystem.getPath(res.path);

    if (!file.exists) {
      this._logger.warning(`Resource ${res.id} not found at ${res.path}`);
      return false;
    }

    if (file.isDirectory) {
      this._logger.warning(`Resource ${res.id} is a directory at ${res.path}`);
      return false;
    }

    const newResource: Resource = {
      ...res,
      tags: res.tags.map((t) => t.toLowerCase()),
      path: await this._platform.fileSystem.mapToWebPath(res.path),
    };
    this.resources.set(newResource.id, newResource);
    return true;
  }
}
