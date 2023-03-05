export type RunResponse = {
  program: string,
  version: string,
  output: string,
  iteration: number,
}

export type LoadProgram = (program: string, output: string, version: string) => void;
