import { program } from "commander";
import fs from "fs/promises";
import path from "path";
import * as z from "zod";

import { Plugin } from "@metabridge/plugin-base";
import * as metabridgeSchema from "@metabridge/schema";

const pkg = require("../package.json");

(async function main() {
  program
    .name("metabridge-cli")
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

  const loadedSchema = metabridgeSchema.parse(
    JSON.parse(await fs.readFile(schemaPath, "utf-8"))
  );

  const { compile } = plugin;

  const output = await compile(loadedSchema);

  await fs.writeFile(outputPath, output, "utf-8");
})();
