import { F22_VERSIONS } from "./f22";
import { S23_VERSIONS } from "./s23";

const getFlavourText = (baristaMode: boolean) => {
  return {
    TEXT_CODE: baristaMode ? "recipe" : "code",
    TEXT_OUTPUT: baristaMode ? "brew" : "output",
    TEXT_PROGRAMS: baristaMode ? "blends" : "programs",
    TEXT_RUN: baristaMode ? "roast" : "run",
    TEXT_STDIN: baristaMode ? "add-ins" : "stdin",
  };
};

const ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:8000/" : "/";

const DEFAULT_VERSION = S23_VERSIONS[0];

export {
  getFlavourText,
  DEFAULT_VERSION,
  ENDPOINT,
  F22_VERSIONS,
  S23_VERSIONS,
};
