import { useState } from "react";
import Editor from "react-simple-code-editor";
import PreviousBrew from "./PreviousBrew";
import {
  DEFAULT_PROGRAM,
  ENDPOINT,
  F22_VERSIONS,
  S23_VERSIONS,
} from "./constants";
import { InterpreterVersion, LoadProgram, RunResponse } from "./types";

function App() {
  const [program, setProgram] = useState(DEFAULT_PROGRAM);
  const [interpreterVersion, setInterpreterVersion] =
    useState<InterpreterVersion>({ quarter: "f22", version: "1" });
  const [output, setOutput] = useState("");
  const [responses, setResponses] = useState<RunResponse[]>([]);
  const [baristaMode, setBaristaMode] = useState(false);

  const { quarter, version } = interpreterVersion;
  // TODO: don't make this stringly-typed :)
  const currentVersions = quarter === "s23" ? S23_VERSIONS : F22_VERSIONS;

  const lastResponse =
    responses.length === 0 ? { iteration: 0 } : responses[responses.length - 1];

  // this is just flavour text helpers
  const TEXT_CODE = baristaMode ? "recipe" : "code";
  const TEXT_OUTPUT = baristaMode ? "brew" : "output";
  const TEXT_PROGRAMS = baristaMode ? "blends" : "programs";
  const TEXT_RUN = baristaMode ? "roast" : "run";

  const setQuarter = (quarter: string) =>
    setInterpreterVersion({ ...interpreterVersion, quarter });
  const setVersion = (version: string) =>
    setInterpreterVersion({ ...interpreterVersion, version });

  function addResponse(
    program: string,
    output: string,
    interpreterVersion: InterpreterVersion,
    iteration: number
  ) {
    let n = [...responses];
    n.push({
      program,
      interpreterVersion,
      output,
      iteration,
    });
    if (n.length > 5) {
      n = n.slice(1);
    }
    setResponses(n);
    setOutput(output);
  }

  function loadProgram(
    program: string,
    output: string,
    interpreterVersion: InterpreterVersion
  ) {
    setProgram(program);
    setOutput(output);
    setInterpreterVersion(interpreterVersion);
  }

  function runProgram() {
    fetch(`${ENDPOINT}${quarter}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        program,
        version,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        addResponse(
          program,
          data.res,
          interpreterVersion,
          lastResponse.iteration + 1
        );
      });
  }

  function PastBrews({
    responses,
    loadProgram,
  }: {
    responses: RunResponse[];
    loadProgram: LoadProgram;
  }) {
    if (responses.length === 0) {
      return <p>no {TEXT_PROGRAMS} yet!</p>;
    }
    return (
      <ul className="p-0 list-none">
        {responses
          .map((response) => (
            <PreviousBrew
              baristaMode={baristaMode}
              response={response}
              loadProgram={loadProgram}
              key={response.iteration}
            />
          ))
          .reverse()}
      </ul>
    );
  }

  return (
    <div className="App">
      <main className="main-container">
        <div></div> {/* empty div for grid */}
        <header>
          <h1 className="text-3xl">
            <span className="font-bold">☕ barista</span> | brewin as a service
          </h1>
          <hr className="my-2" />
        </header>
        <section>
          <h2 className="text-xl font-semibold mb-1">past {TEXT_PROGRAMS}</h2>
          <PastBrews responses={responses} loadProgram={loadProgram} />
        </section>
        <div>
          <section className="flex flex-row justify-between">
            <h2 className="text-xl font-semibold">your {TEXT_CODE}</h2>
            <div>
              <select
                className="btn btn-blue-outline mr-1 pl-1"
                value={quarter}
                onChange={(e) => setQuarter(e.target.value)}
                disabled
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
          <Editor
            className="editor border my-1"
            value={program}
            onValueChange={(program) => setProgram(program)}
            highlight={
              (code) => code /* this is an identity -- no highlighting */
            }
            padding={10}
          />

          <h2 className="text-xl font-semibold mt-3 mb-1">
            your {TEXT_OUTPUT}
          </h2>
          <Editor
            className="editor border"
            value={output}
            onValueChange={() => ""}
            highlight={
              (code) => code /* this is an identity -- no highlighting */
            }
            padding={10}
            readOnly={true}
          />
        </div>
        <footer>
          <hr className="my-1" />
          <p className="text-xs">
            made by{" "}
            <a className="underline" href="https://matthewwang.me">
              matt
            </a>{" "}
            for{" "}
            <a className="underline" href="https://github.com/UCLA-CS-131">
              CS 131
            </a>
            ; on{" "}
            <a
              className="underline"
              href="https://github.com/UCLA-CS-131/barista"
            >
              github
            </a>
            .{" "}
            <button
              className="underline"
              onClick={() => setBaristaMode(!baristaMode)}
            >
              barista mode.
            </button>
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
