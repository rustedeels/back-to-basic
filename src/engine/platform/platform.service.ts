import { IViewRender } from '../core/composition/index.js';
import {
  EventsHandler,
  Inject,
  Injectable,
  LoggerService,
} from '../core/index.js';
import { Subscription } from '../core/reactive/models.js';
import { PlatformEvents } from './events.js';
import { IFileSystem } from './file-system.js';
import { ISavegame } from './save-game.js';

export interface IPlatform {
  get fileSystem(): IFileSystem;
  get savegame(): ISavegame;
  get viewRender(): IViewRender;
  exit(code?: number): Promise<void>;
}

@Injectable()
export class PlatformService implements IPlatform {
  private _fileSystem?: IFileSystem;
  private _savegame?: ISavegame;
  private _viewRender?: IViewRender;
  private _exitAction?: (code?: number) => Promise<void>;

  private _exitSub?: Subscription;

  @Inject()
  private _logger!: LoggerService;

  @Inject()
  private _events!: EventsHandler<PlatformEvents>;

  /** ========================File System=========================== */
  public get fileSystem(): IFileSystem {
    if (!this._fileSystem) {
      throw new Error('File system module is not initialized.');
    }
    return this._fileSystem;
  }

  private set fileSystem(value: IFileSystem) {
    this._fileSystem = value;
  }
  /** ============================================================== */

  /** =======================View Render============================ */
  public get viewRender(): IViewRender {
    if (!this._viewRender) {
      throw new Error('View render module is not initialized.');
    }
    return this._viewRender;
  }

  private set viewRender(value: IViewRender) {
    this._viewRender = value;
  }
  /** ============================================================== */

  /** ==========================Savegame============================ */
  public get savegame(): ISavegame {
    if (!this._savegame) {
      throw new Error('Savegame module is not initialized.');
    }
    return this._savegame;
  }

  private set savegame(value: ISavegame) {
    this._savegame = value;
  }
  /** ============================================================== */

  /** ========================Exit Action=========================== */
  public get exit(): (code?: number) => Promise<void> {
    return async (code?: number) => {
      if (!this._exitAction) {
        throw new Error('Exit action is not initialized.');
      }

      this._events.emit('beforeExit', code ?? 0);
      this._logger.info('Exiting with code', code ?? 0);

      await this._exitAction(code ?? 0);
    };
  }

  private set exit(value: (code?: number) => Promise<void>) {
    this._exitAction = value;
  }
  /** ============================================================== */

  /** Initialize operating system systems */
  public initialize(systems: Partial<IPlatform>): void {
    if (!this._exitSub) {
      this._exitSub = this._events
        .get('exit')
        .subscribe(code => this.exit(code));
    }

    Object.assign(this, systems);
    this._logger.info('Initializing platform services', Object.keys(systems));
  }

  /**
   * Check if a system is initialized
   * @param systemName system to check
   * @returns true if system is initialized
   */
  public hasInit(systemName: keyof IPlatform): boolean {
    try {
      return !!this[systemName];
    } catch {
      return false;
    }
  }
}
