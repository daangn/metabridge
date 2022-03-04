import { Plugin } from "@nextbridge/plugin-base";
import { compile } from "json-schema-to-typescript";
import { camelCase } from "camel-case";
import { pascalCase } from "pascal-case";
import fs from "fs/promises";
import path from "path";
import { pipe } from "lodash/fp";
import dedent from "dedent";
import prettier from "prettier";

const plugin: Plugin = {
  async compile(schema) {
    const lines: string[] = [];

    const properties = Object.entries(schema.protocols).reduce(
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

    const operations = Object.entries(schema.protocols).map(
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
          }
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
