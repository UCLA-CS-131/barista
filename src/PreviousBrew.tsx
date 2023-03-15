import { LoadProgram, RunResponse } from "./types";

type Props = {
  response: RunResponse;
  loadProgram: LoadProgram;
  baristaMode: boolean;
};

export default function PreviousBrew({
  baristaMode,
  response,
  loadProgram,
}: Props) {
  const { program, output, interpreterVersion, iteration } = response;
  return (
    <li className="single-run border-t py-2 text-ellipsis overflow-hidden whitespace-nowrap">
      <span className="flex flex-row justify-between">
        <span>
          {baristaMode ? "blend" : "program"} #{iteration}
        </span>
        <button
          className="underline"
          onClick={() => loadProgram(program, output, interpreterVersion)}
        >
          load
        </button>
      </span>
      <span className="text-xs">
        code: <code>{program}</code>
        <br />
        out: <code>{output}</code>
      </span>
    </li>
  );
}
