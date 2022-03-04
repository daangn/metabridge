import { program } from "commander";
import * as z from "zod";
import path from "path";
import fs from "fs/promises";
import to from "await-to-js";
import { Plugin } from "@nextbridge/plugin-base";
import * as nextBridgeSchema from "@nextbridge/schema";

const pkg = require("../package.json");

(async function main() {
  program
    .name("nextbridge-cli")
    .description("JSON Schema based WebView bridge integration")
    .version(pkg.version);

  program
    .requiredOption("-p, --plugin <plugin>")
    .requiredOption("-s, --schema <path>")
    .requiredOption("-o, --output <path>");

  program.parse(process.argv);

  const Options = z
    .object({
      plugin: z.string(),
      schema: z.string(),
      output: z.string(),
    })
    .transform(({ schema, plugin, output }) => ({
      plugin: require(plugin).default as Plugin,
      schemaPath: path.resolve(schema),
      outputPath: path.resolve(output),
    }));

  const { schemaPath, plugin, outputPath } = Options.parse(program.opts());

  const loadedSchema = nextBridgeSchema.parse(
    JSON.parse(await fs.readFile(schemaPath, "utf-8"))
  );

  const { compile } = plugin;

  const output = await compile(loadedSchema);

  console.log(output);

  // console.log(schemaLoadErr, schema);
})();
