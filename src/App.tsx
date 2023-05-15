import { useState } from "react";
import Editor from "react-simple-code-editor";
import {
  DEFAULT_VERSION,
  ENDPOINT,
  F22_VERSIONS,
  S23_VERSIONS,
  getFlavourText,
} from "./constants";
import { InterpreterVersion, RunResponse } from "./types";
import { BaristaContext } from "./BaristaContext";
import PastBrews from "./components/PastBrews";

function App() {
  const [program, setProgram] = useState(DEFAULT_VERSION.defaultProgram);
  const [stdin, setStdin] = useState("");
  const [interpreterVersion, setInterpreterVersion] =
    useState<InterpreterVersion>({
      quarter: DEFAULT_VERSION.quarter,
      version: DEFAULT_VERSION.version,
    });
  const [output, setOutput] = useState("");
  const [responses, setResponses] = useState<RunResponse[]>([]);
  const [baristaMode, setBaristaMode] = useState(false);

  const { quarter, version } = interpreterVersion;
  // TODO: don't make this stringly-typed :)
  const currentVersions = quarter === "s23" ? S23_VERSIONS : F22_VERSIONS;

  const lastResponse =
    responses.length === 0 ? { iteration: 0 } : responses[responses.length - 1];

  const { TEXT_CODE, TEXT_OUTPUT, TEXT_PROGRAMS, TEXT_RUN, TEXT_STDIN } =
    getFlavourText(baristaMode);

  const setQuarter = (quarter: string) =>
    setInterpreterVersion({ ...interpreterVersion, quarter });
  const setVersion = (version: string) =>
    setInterpreterVersion({ ...interpreterVersion, version });

  function addResponse(
    program: string,
    stdin: string,
    output: string,
    interpreterVersion: InterpreterVersion,
    iteration: number
  ) {
    let n = [...responses];
    n.push({
      program,
      stdin,
      output,
      interpreterVersion,
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
    stdin: string,
    output: string,
    interpreterVersion: InterpreterVersion
  ) {
    setProgram(program);
    setStdin(stdin);
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
        stdin,
        version,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        const output = Array.isArray(data.res) ? data.res.join("\n") : data.res;
        addResponse(
          program,
          stdin,
          output,
          interpreterVersion,
          lastResponse.iteration + 1
        );
      });
  }

  return (
    <BaristaContext.Provider value={baristaMode}>
      <div className="App">
        <main className="main-container">
          <div></div> {/* empty div for grid */}
          <header>
            <h1 className="text-3xl">
              <span className="font-bold">☕ barista</span> | brewin as a
              service
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

            <h2 className="text-xl font-semibold">your {TEXT_STDIN}</h2>
            <Editor
              className="editor border my-1"
              value={stdin}
              onValueChange={(stdin) => setStdin(stdin)}
              highlight={
                (code) => code /* this is an identity -- no highlighting */
              }
              padding={10}
              style={{ minHeight: "1rem" }}
            />

            <h2 className="text-xl font-semibold mt-3 mb-1">
              your {TEXT_OUTPUT}
            </h2>
            <textarea
              className="editor border p-2"
              value={output}
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
    </BaristaContext.Provider>
  );
}

export default App;
