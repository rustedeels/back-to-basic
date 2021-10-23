export interface IFileSystem {
  /** Newline char */
  get newLine(): string;
  /** Char that separates a path part */
  get seprator(): string;

  /** Directory where application was started */
  get workingDirectory(): Promise<string>;

  /** Diretory where to store data */
  get userData(): Promise<string>;

  /** Read a text file from a PATH */
  readTextFile(path: string): Promise<string>;
  /** Write text content to PATH */
  writeTextFile(path: string, content: string): Promise<void>;

  /**
   * Delete a file or directory
   *
   * @param path path to delete
   * @param recurse in case of directory, delete recursively
   * @returns true if deleted
   */
  delete(path: string, recurse?: boolean): Promise<boolean>;

  /** List all files in directory */
  listDirectory(path: string): Promise<PathEntry[]>;

  /** Get path details */
  getPath(path: string): Promise<PathEntry>;

  /** Ensure directory exists */
  ensureDirectory(path: string): Promise<void>;

  /** Copy a file */
  copy(src: string, dest: string): Promise<void>;

  /** Move a file */
  move(src: string, dest: string): Promise<void>;

  /** Map webpath to OS path */
  mapToOSPath(path: string): Promise<string>;

  /** Map OS path to webpath */
  mapToWebPath(path: string): Promise<string>;
}

export interface IPath {
  path: string;
  exists: boolean;
}

export interface IFile extends IPath {
  isDirectory: false;
}

export interface IDirectory extends IPath {
  isDirectory: true;
}

export type PathEntry = IFile | IDirectory;
