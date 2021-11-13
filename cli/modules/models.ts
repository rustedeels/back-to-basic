export interface RunResult {
  success: boolean;
  code: number;
}

export interface ProjectInfo {
  cwd: string;
  cache: string;
  src: string;
  dist: string;
  styles: string;
  public: string;
  assets: string;
}
