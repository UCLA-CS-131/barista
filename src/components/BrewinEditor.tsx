import { useContext, useState } from "react";
import Editor from "react-simple-code-editor";
import { DEFAULT_VERSION, ENDPOINT, getFlavourText, S23_VERSIONS } from "../constants";
import { InterpreterVersion, RunResponse } from "../types";
import { BaristaContext } from "../BaristaContext";
import Prism from "prismjs";
import "./BrewinEditor.css";

import PastBrews from "./PastBrews";
import EditorToolbar from "./EditorToolbar";

function getHighlighter(quarter: string, version: string){
  if (quarter === "s23"){
    return S23_VERSIONS[parseInt(version) - 1]?.highlighter ?? {};
  }
  return {};
}

export default function BrewinEditor() {
  const baristaMode = useContext(BaristaContext);

  const [program, setProgram] = useState(DEFAULT_VERSION.defaultProgram);
  const [stdin, setStdin] = useState("");
  const [interpreterVersion, setInterpreterVersion] =
    useState<InterpreterVersion>({
      quarter: DEFAULT_VERSION.quarter,
      version: DEFAULT_VERSION.version,
    });
  const [output, setOutput] = useState("");
  const [responses, setResponses] = useState<RunResponse[]>([]);

  const { quarter, version } = interpreterVersion;

  const { TEXT_OUTPUT, TEXT_PROGRAMS, TEXT_STDIN } =
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
          responses.length === 0
            ? 0
            : responses[responses.length - 1].iteration + 1
        );
      });
  }

  const Sidebar = () => (
    <section>
      <h2 className="text-xl font-semibold mb-1">past {TEXT_PROGRAMS}</h2>
      <PastBrews responses={responses} loadProgram={loadProgram} />
    </section>
  );

  return (
    <>
      <Sidebar />
      <div>
        <EditorToolbar
          quarter={quarter}
          setQuarter={setQuarter}
          version={version}
          setVersion={setVersion}
          runProgram={runProgram}
        />

        <Editor
          className="editor border my-1"
          value={program}
          onValueChange={(program) => setProgram(program)}
          highlight={(program) => Prism.highlight(program, getHighlighter(quarter, version), "brewin")}
          padding={10}
        />

        <h2 className="text-xl font-semibold">your {TEXT_STDIN}</h2>
        <Editor
          className="editor border my-1"
          value={stdin}
          onValueChange={(stdin) => setStdin(stdin)}
          highlight={(code) => code}
          padding={10}
          style={{ minHeight: "1rem" }}
        />

        <h2 className="text-xl font-semibold mt-3 mb-1">your {TEXT_OUTPUT}</h2>
        <textarea
          className="editor border p-2"
          value={output}
          readOnly={true}
        />
      </div>
    </>
  );
}
