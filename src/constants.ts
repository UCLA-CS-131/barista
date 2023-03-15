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
