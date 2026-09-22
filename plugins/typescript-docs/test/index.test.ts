import { execFileSync } from "child_process";
import path from "path";

execFileSync(
  "yarn",
  [
    "metabridge-cli",
    "--plugin",
    path.resolve(__dirname, "../lib"),
    "--schema",
    "./test/schema.json",
    "--output",
    "./test/schema.output.html",
  ],
  { stdio: "inherit" }
);
