export type RunResponse = {
  program: string;
  stdin: string;
  interpreterVersion: InterpreterVersion;
  output: string;
  iteration: number;
};

export type LoadProgram = (
  program: string,
  stdin: string,
  output: string,
  interpreterVersion: InterpreterVersion
) => void;

// TODO: we can narrow these types
export type InterpreterVersion = {
  quarter: string;
  version: string;
};
