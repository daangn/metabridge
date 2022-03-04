import assert from "assert";
import exec from "exec-sh";
import fs from "fs/promises";
import path from "path";
import dedent from "dedent";

(async () => {
  const command = [
    "yarn",
    "nextbridge-cli",
    "--plugin",
    "@nextbridge/plugin-typescript",
    "--schema",
    "./test/schema.json",
    "--output",
    "./test/schema.output.ts",
  ].join(" ");

  await exec.promise(command, true);

  const output = await fs.readFile(
    path.resolve("./test/schema.output.ts"),
    "utf-8"
  );

  assert.equal(
    output,
    dedent`
      /* tslint:disable */
      /**
       * This file was automatically generated by json-schema-to-typescript.
       * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
       * and run json-schema-to-typescript to regenerate this file.
       */

      export interface REQROUTER {
        something?: Something;
        [k: string]: unknown;
      }
      export interface Something {
        app: string;
      }
    ` + "\n"
  );
})();
