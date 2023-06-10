import { useContext, useState } from "react";
import Editor from "react-simple-code-editor";
import { DEFAULT_VERSION, ENDPOINT, getFlavourText } from "../constants";
import { InterpreterVersion, RunResponse } from "../types";
import { BaristaContext } from "../BaristaContext";
import Prism from "prismjs";
import "./BrewinEditor.css";

import PastBrews from "./PastBrews";
import EditorToolbar from "./EditorToolbar";

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

  const par = "(\\()";
  const symbol = /(?!\d)[-+*/~!@$%^=<>{}\w]+/.source;
  const space = "(?=\\s)";
  const optionalSpace = "\\s*";

  function primitive(pattern: string) {
    return RegExp(
      /([\s([])/.source + "(?:" + pattern + ")" + /(?=[\s)])/.source
    );
  }

  const brewinV1 = {
    comment: /#.*/,
    string: {
      pattern: /"(?:[^"\\]|\\.)*"/,
      greedy: true,
      inside: {
        argument: /[-A-Z]+(?=[.,\s])/,
        symbol: RegExp("`" + symbol + "'"),
      },
    },
    keyword: [
      {
        pattern: RegExp(
          par +
            optionalSpace +
            "(?:and|(?:cl-)?if|while|(?:lexical-)?let\\*?|while\
            )" +
            space
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          par + optionalSpace + "(?:begin|set|print|call)" + space
        ),
        lookbehind: true,
      },
      {
        pattern: primitive(/return|inputi|inputs/.source),
        lookbehind: true,
      },
    ],
    class: {
      pattern: primitive(/class/.source),
      lookbehind: true,
      alias: "class-name",
    },
    boolean: {
      pattern: primitive(/false|true/.source),
      lookbehind: true,
    },
    classRefs: {
      pattern: primitive(/me/.source),
      lookbehind: true,
    },
    new: {
      pattern: primitive(/new/.source),
      lookbehind: true,
    },
    null: {
      pattern: primitive(/null/.source),
      lookbehind: true,
    },
    number: {
      pattern: primitive(/[-+]?\d+(?:\.\d*)?/.source),
      lookbehind: true,
    },
    classAttributes: {
      pattern: primitive(/method|field/.source),
      lookbehind: true,
    },
    punctuation: [
      // open paren, brackets, and close paren
      /(?:['`,]?\(|[)\[\]])/, //eslint-disable-line
    ],
  };

  const brewinV2 = {
    ...brewinV1,
    primitiveTypes: {
      pattern: primitive(/void|int|bool|string/.source),
      lookbehind: true,
    },
    classRefs: {
      pattern: primitive(/me|super/.source),
      lookbehind: true,
    },
  };

  const brewinV3 = {
    ...brewinV2,
    class: {
      pattern: primitive(/t?class/.source),
      lookbehind: true,
      alias: "class-name",
    },
    genericTypeConcatChar: {
      pattern: RegExp(/@/.source),
      lookbehind: true,
    },
    exceptionKeywords: {
      pattern: RegExp(par + "try|throw\\s+"),
      lookbehind: true,
    },
  };

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
          highlight={(program) => Prism.highlight(program, brewinV3, "brewin")}
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
