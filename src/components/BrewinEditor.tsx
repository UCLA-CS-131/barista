import { useContext, useState } from "react";
import Editor from "react-simple-code-editor";
import { DEFAULT_VERSION, ENDPOINT, getFlavourText } from "../constants";
import { InterpreterVersion, RunResponse } from "../types";
import { BaristaContext } from "../BaristaContext";
import Prism from "prismjs";
import "../prism.css";

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
  const nestedPar =
    /(?:[^()]|\((?:[^()]|\((?:[^()]|\((?:[^()]|\((?:[^()]|\([^()]*\))*\))*\))*\))*\))*/
      .source;
  function primitive(pattern: string) {
    return RegExp(
      /([\s([])/.source + "(?:" + pattern + ")" + /(?=[\s)])/.source
    );
  }
  function simple_form(name: string) {
    return RegExp(/(\()/.source + "(?:" + name + ")" + /(?=[\s\)])/.source); //eslint-disable-line
  }
  const space = "(?=\\s)";
  const language = {
    // Three or four semicolons are considered a heading.
    // See https://www.gnu.org/software/emacs/manual/html_node/elisp/Comment-Tips.html
    heading: {
      pattern: /;;;.*/,
      alias: ["comment", "title"],
    },
    comment: /#./,
    string: {
      pattern: /"(?:[^"\\]|\\.)*"/,
      greedy: true,
      inside: {
        argument: /[-A-Z]+(?=[.,\s])/,
        symbol: RegExp("`" + symbol + "'"),
      },
    },
    "quoted-symbol": {
      pattern: RegExp("#?'" + symbol),
      alias: ["variable", "symbol"],
    },
    "lisp-property": {
      pattern: RegExp(":" + symbol),
      alias: "property",
    },
    splice: {
      pattern: RegExp(",@?" + symbol),
      alias: ["symbol", "variable"],
    },
    keyword: [
      {
        pattern: RegExp(
          par +
            "(?:and|(?:cl-)?letf|cl-loop|cond|cons|error|if|(?:lexical-)?let\\*?|message|not|null|or|provide|require|setq|unless|use-package|when|while\
            )" +
            space
        ),
        lookbehind: true,
      },
      {
        pattern: RegExp(
          par + "(?:append|by|collect|concat|do|finally|for|in|return)" + space
        ),
        lookbehind: true,
      },
    ],
    declare: {
      pattern: simple_form(/declare/.source),
      lookbehind: true,
      alias: "keyword",
    },
    interactive: {
      pattern: simple_form(/interactive/.source),
      lookbehind: true,
      alias: "keyword",
    },
    boolean: {
      pattern: primitive(/false|true/.source),
      lookbehind: true,
    },
    number: {
      pattern: primitive(/[-+]?\d+(?:\.\d*)?/.source),
      lookbehind: true,
    },
    defvar: {
      pattern: RegExp(par + "def(?:const|custom|group|var)\\s+" + symbol),
      lookbehind: true,
      inside: {
        keyword: /^def[a-z]+/,
        variable: RegExp(symbol),
      },
    },
    defun: {
      pattern: RegExp(
        par +
          /(?:cl-)?(?:defmacro|defun\*?)\s+/.source +
          symbol +
          /\s+\(/.source +
          nestedPar +
          /\)/.source
      ),
      lookbehind: true,
      greedy: true,
      inside: {
        keyword: /^(?:cl-)?def\S+/,
        // See below, this property needs to be defined later so that it can
        // reference the language object.
        arguments: null,
        function: {
          pattern: RegExp("(^\\s)" + symbol),
          lookbehind: true,
        },
        punctuation: /[()]/,
      },
    },
    lambda: {
      pattern: RegExp(
        par +
          "lambda\\s+\\(\\s*(?:&?" +
          symbol +
          "(?:\\s+&?" +
          symbol +
          ")*\\s*)?\\)"
      ),
      lookbehind: true,
      greedy: true,
      inside: {
        keyword: /^lambda/,
        // See below, this property needs to be defined later so that it can
        // reference the language object.
        arguments: null,
        punctuation: /[()]/,
      },
    },
    car: {
      pattern: RegExp(par + symbol),
      lookbehind: true,
    },
    punctuation: [
      // open paren, brackets, and close paren
      /(?:['`,]?\(|[)\[\]])/, //eslint-disable-line
      // cons
      {
        pattern: /(\s)\.(?=\s)/,
        lookbehind: true,
      },
    ],
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
          highlight={(program) => Prism.highlight(program, language, "js")}
          padding={10}
        />

        <h2 className="text-xl font-semibold">your {TEXT_STDIN}</h2>
        <Editor
          className="editor border my-1"
          value={stdin}
          onValueChange={(stdin) => setStdin(stdin)}
          highlight={(code) => Prism.highlight(code, language, "js")}
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
