import { camelCase } from "camel-case";
import dedent from "dedent";
import fs from "fs/promises";
import { compile } from "json-schema-to-typescript";
import { pipe } from "lodash/fp";
import { pascalCase } from "pascal-case";
import path from "path";
import prettier from "prettier";

import { Plugin } from "@metabridge/plugin-base";

const plugin: Plugin = {
  async compile(schema) {
    const lines: string[] = [];

    const properties = Object.entries(schema.queries).reduce(
      (acc, [type, { requestBody, response }]) => {
        return {
          ...acc,
          [pascalCase(type + " RequestBody")]: requestBody,
          [pascalCase(type + " Response")]: response,
        };
      },
      {} as any
    );

    const schemaTypeName = pascalCase(schema.appName + " BridgeSchema");

    const typeDefs = await compile(
      {
        properties,
        additionalProperties: false,
        required: Object.keys(properties),
        $defs: schema.$defs,
      },
      schemaTypeName
    );

    lines.push(typeDefs);

    await fs.readFile(
      path.join(__dirname, "../src/__scaffolds__/makeScaffoldedBridge.ts"),
      "utf-8"
    );

    const operations = Object.entries(schema.queries).map(
      ([type, { operationId, description }]) => {
        const functionName = camelCase(operationId);

        const requestBodyTypeName =
          schemaTypeName + `["` + pascalCase(type + " RequestBody") + `"]`;
        const responseTypeName =
          schemaTypeName + `["` + pascalCase(type + " Response") + `"]`;

        return dedent`
          /**
           * ${description}
           */
          ${functionName}(req:  ${requestBodyTypeName}): Promise<${responseTypeName}> {
            return driver.onCalled("${type}", req)
          },
        `;
      },
      {} as any
    );

    const sdk = pipe(
      replaceAll("Scaffolded", pascalCase(schema.appName)),
      replaceAll("    /* operations */", operations.join(`\n`))
    )(
      await fs.readFile(
        path.join(__dirname, "../src/__scaffolds__/makeScaffoldedBridge.ts"),
        "utf-8"
      )
    );

    lines.push(sdk);

    const output = lines.join(`\n`);

    return prettier.format(output);
  },
};

function replaceAll(from: string, to: string) {
  return (str: string) => {
    return str.split(from).join(to);
  };
}

export default plugin;
