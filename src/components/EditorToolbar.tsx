import { useContext } from "react";
import { BaristaContext } from "../BaristaContext";
import { F22_VERSIONS, S23_VERSIONS, getFlavourText } from "../constants";

type Props = {
  quarter: string;
  setQuarter: (quarter: string) => void;
  version: string;
  setVersion: (version: string) => void;
  runProgram: () => void;
};

export default function EditorToolbar({
  quarter,
  setQuarter,
  version,
  setVersion,
  runProgram,
}: Props) {
  const baristaMode = useContext(BaristaContext);

  // TODO: don't make this stringly-typed :)
  const currentVersions = quarter === "s23" ? S23_VERSIONS : F22_VERSIONS;

  const { TEXT_CODE, TEXT_RUN } = getFlavourText(baristaMode);

  return (
    <section className="flex flex-row justify-between">
      <h2 className="text-xl font-semibold">your {TEXT_CODE}</h2>
      <div>
        <select
          className="btn btn-blue-outline mr-1 pl-1"
          value={quarter}
          onChange={(e) => setQuarter(e.target.value)}
        >
          <option value="f22">fall 2022</option>
          <option value="s23">spring 2023</option>
        </select>
        <select
          className="btn btn-blue-outline mr-1 pl-1"
          value={version}
          onChange={(e) => setVersion(e.target.value)}
        >
          {currentVersions.map(({ version, title }) => (
            <option value={version} key={title}>
              v{version}: {title}
            </option>
          ))}
        </select>
        <button className="btn btn-blue" onClick={runProgram}>
          {TEXT_RUN}!
        </button>
      </div>
    </section>
  );
}
