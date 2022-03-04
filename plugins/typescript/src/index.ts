import { Plugin } from "@nextbridge/plugin-base";
import { compile } from "json-schema-to-typescript";

const plugin: Plugin = {
  async compile(schema) {
    const output: string[] = [];

    for (let type in schema.protocols) {
      const { requestBody, response } = schema.protocols[type];
      output.push(
        await compile(
          {
            ...requestBody,
            $defs: schema.$defs,
          },
          type
        )
      );
    }

    return output.join(`\n`);
  },
};

export default plugin;
