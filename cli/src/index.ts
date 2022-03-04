import { program } from "commander";
import * as z from "zod";
import path from "path";
import fs from "fs/promises";
import to from "await-to-js";

const pkg = require("../package.json");

(async function main() {
  program
    .name("nextbridge-cli")
    .description("JSON Schema based WebView bridge integration")
    .version(pkg.version);

  program
    .requiredOption("-p, --plugins <plugins...>")
    .requiredOption("-s, --schema <path>")
    .requiredOption("-o, --output <path>");

  program.parse(process.argv);

  const Options = z
    .object({
      plugins: z.array(z.string()),
      schema: z.string(),
      output: z.string(),
    })
    .transform(({ schema, plugins, output }) => ({
      plugins,
      schemaPath: path.resolve(schema),
      outputPath: path.resolve(output),
    }));

  const { schemaPath, plugins, outputPath } = Options.parse(program.opts());

  const [schemaLoadErr, schema] = await to(fs.readFile(schemaPath));

  console.log(schemaLoadErr, schema);
})();
