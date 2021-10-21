export interface PlatformEvents {
  /** Called before shutdow starts */
  beforeExit: number;
  /** Start shutdown process */
  exit: number;
  /** A new system is about to be initialized */
  initSystem: string[];
}
