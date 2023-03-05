export const DEFAULT_PROGRAM = `func main
 assign v1 20
 funccall print v1
endfunc`;

export const ENDPOINT =
  process.env.NODE_ENV === "development" ? "http://localhost:8000/f22" : "/f22";
