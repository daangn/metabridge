import { Plugin } from "@metabridge/plugin-base";
import { camelCase } from "camel-case";
import { pascalCase } from "pascal-case";
import fs from "fs/promises";
import path from "path";
import * as Eta from "eta";

const plugin: Plugin = {
  async compile(schema) {
    const template = await fs.readFile(
      path.join(__dirname, "../template/dist/index.html"),
      "utf-8"
    );

    Eta.configure({
      autoEscape: false,
    });

    const title = pascalCase(schema.appName + " Bridge");

    const output = await Eta.render(template, {
      title,
      schema: JSON.stringify(schema),
    });

    if (!output) {
      throw new Error("Compile failed");
    }

    return output;
  },
};

export default plugin;
