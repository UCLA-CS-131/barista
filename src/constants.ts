export const DEFAULT_PROGRAM = `func main
 assign v1 20
 funccall print v1
endfunc`;

export const ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:8000/" : "/";

export const F22_VERSIONS = [
  { version: "1", title: "brewin" },
  { version: "2", title: "brewin++" },
  { version: "3", title: "brewin#" },
];

export const S23_VERSIONS = [
  { version: "1", title: "brewin" },
  { version: "2", title: "brewin++" },
  { version: "3", title: "brewin#" },
];

export const getFlavourText = (baristaMode: boolean) => {
  return {
    TEXT_CODE: baristaMode ? "recipe" : "code",
    TEXT_OUTPUT: baristaMode ? "brew" : "output",
    TEXT_PROGRAMS: baristaMode ? "blends" : "programs",
    TEXT_RUN: baristaMode ? "roast" : "run",
    TEXT_STDIN: baristaMode ? "add-ins" : "stdin"
  }
}
