import { useContext } from "react";
import { LoadProgram, RunResponse } from "../types";
import { BaristaContext } from "../BaristaContext";
import { getFlavourText } from "../constants";

type Props = {
  response: RunResponse;
  loadProgram: LoadProgram;
};

export default function PreviousBrew({ response, loadProgram }: Props) {
  const baristaMode = useContext(BaristaContext);

  const { TEXT_PROGRAM } = getFlavourText(baristaMode);

  const { program, output, stdin, interpreterVersion, iteration } = response;
  return (
    <li className="single-run border-t py-2 text-ellipsis overflow-hidden whitespace-nowrap">
      <span className="flex flex-row justify-between">
        <span>
          {TEXT_PROGRAM} #{iteration}
        </span>
        <button
          className="underline"
          onClick={() =>
            loadProgram(program, stdin, output, interpreterVersion)
          }
        >
          load
        </button>
      </span>
      <span className="text-xs">
        code: <code>{program}</code>
        <br />
        in: <code>{stdin.trim() === "" ? "-" : stdin}</code> | out:{" "}
        <code>{output}</code>
      </span>
    </li>
  );
}
