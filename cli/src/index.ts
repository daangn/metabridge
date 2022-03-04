import { program } from "commander";
import * as z from "zod";
import pkg from "../package.json";
import path from "path";
import fs from "fs/promises";
import to from "await-to-js";

(async function main() {
  program
    .name("nextbridge-cli")
    .description("JSON Schema based WebView bridge integration")
    .version(pkg.version);

  program
    .requiredOption("-s, --schema <path>")
    .requiredOption("-p, --plugins <plugins...>")
    .requiredOption("-o, --output <path>");

  program.parse(process.argv);

  const Options = z.object({
    schema: z.string(),
    plugins: z.array(z.string()),
    output: z.string(),
  });

  const {
    schema: schemaPath,
    plugins,
    output: outputPath,
  } = Options.parse(program.opts());

  const [schemaLoadErr, schema] = await to(
    fs.readFile(path.resolve(schemaPath))
  );

  console.log(schemaLoadErr, schema);
})();
