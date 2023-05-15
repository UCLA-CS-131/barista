import { useContext } from "react";
import { BaristaContext } from "../BaristaContext";
import { LoadProgram, RunResponse } from "../types";
import { getFlavourText } from "../constants";
import PreviousBrew from "./PreviousBrew";

export default function PastBrews({
  responses,
  loadProgram,
}: {
  responses: RunResponse[];
  loadProgram: LoadProgram;
}) {
  const baristaMode = useContext(BaristaContext);

  const { TEXT_PROGRAMS } = getFlavourText(baristaMode);

  if (responses.length === 0) {
    return <p>no {TEXT_PROGRAMS} yet!</p>;
  }
  return (
    <ul className="p-0 list-none">
      {responses
        .map((response) => (
          <PreviousBrew
            response={response}
            loadProgram={loadProgram}
            key={response.iteration}
          />
        ))
        .reverse()}
    </ul>
  );
}
