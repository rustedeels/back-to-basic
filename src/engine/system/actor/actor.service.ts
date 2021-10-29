import {
  Inject,
  Injectable,
  LoggerService,
} from '/engine/core/index.js';
import { ArrayMap } from '/engine/helpers/array-map.js';

import {
  IActor,
  IActorProvider,
} from './model.js';

@Injectable()
export class ActorService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private readonly _providers = new ArrayMap<string, IActorProvider<any, any>>();

  @Inject()
  private _logger!: LoggerService;

  /** Register a new actor provider */
  public registerProvider<K, T extends IActor<K>>(provider: IActorProvider<K, T>) {
    for (const target of provider.targets) {
      this._providers.set(target, provider);
    }
  }

  /** Run actor through all providers */
  public async ensureActor<K, T extends IActor<K>>(type: string, id: K, state: Partial<T>): Promise<T> {
    const providers = this._providers.get(type);
    if (!providers || !providers.length) {
      this._logger.error(`No actor provider found for type ${type}`);
      throw new Error(`No actor provider found for ${type}`);
    }

    const rootProvider = providers.find(p => p.root);
    if (!rootProvider) {
      this._logger.error(`No root actor provider found for type ${type}`);
      throw new Error(`No root actor provider found for ${type}`);
    }

    let value = await rootProvider.ensure({ id, ...state });

    for (const provider of providers) {
      if (provider === rootProvider) {
        continue;
      }

      value = await provider.ensure(value);
    }

    return value;
  }
}
