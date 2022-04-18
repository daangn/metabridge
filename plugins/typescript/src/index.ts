import { camelCase, pascalCase } from "change-case";
import dedent from "dedent";
import fs from "fs/promises";
import { compile } from "json-schema-to-typescript";
import { pipe } from "lodash/fp";
import path from "path";
import prettier from "prettier";

import { Plugin } from "@metabridge/plugin-base";

const plugin: Plugin = {
  async compile(schema) {
    const lines: string[] = [];

    const properties = {
      ...Object.entries(schema.queries).reduce(
        (acc, [queryName, { requestBody, response }]) => {
          return {
            ...acc,
            [pascalCase(queryName + " RequestBody")]: requestBody,
            [pascalCase(queryName + " Response")]: response,
          };
        },
        {} as any
      ),
      ...Object.entries(schema.subscriptions ?? {}).reduce(
        (acc, [subscriptionName, { requestBody, response }]) => {
          return {
            ...acc,
            [pascalCase(subscriptionName + " RequestBody")]: requestBody,
            [pascalCase(subscriptionName + " Response")]: response,
          };
        },
        {} as any
      ),
    };

    const schemaRootTypeName = pascalCase(schema.appName + " BridgeSchema");

    const typeDefs = await compile(
      {
        properties,
        additionalProperties: false,
        required: Object.keys(properties),
        $defs: schema.$defs,
      },
      schemaRootTypeName
    );

    lines.push(typeDefs);

    await fs.readFile(
      path.join(__dirname, "../src/__scaffolds__/makeScaffoldedBridge.ts"),
      "utf-8"
    );

    const queries = Object.entries(schema.queries).map(
      ([queryName, { operationId, description }]) => {
        const functionName = camelCase(operationId);

        const requestBodyTypeName =
          schemaRootTypeName +
          `["` +
          pascalCase(queryName + " RequestBody") +
          `"]`;
        const responseTypeName =
          schemaRootTypeName +
          `["` +
          pascalCase(queryName + " Response") +
          `"]`;

        return dedent`
          /**
           * ${description}
           */
          ${functionName}(req: ${requestBodyTypeName}): Promise<${responseTypeName}> {
            return driver.onQueried("${queryName}", req)
          },
        `;
      },
      {} as any
    );

    const subscriptions = Object.entries(schema.subscriptions ?? {}).map(
      ([subscriptionName, { operationId, description }]) => {
        const functionName = camelCase(operationId);

        const requestBodyTypeName =
          schemaRootTypeName +
          `["` +
          pascalCase(subscriptionName + " RequestBody") +
          `"]`;
        const responseTypeName =
          schemaRootTypeName +
          `["` +
          pascalCase(subscriptionName + " Response") +
          `"]`;

        return dedent`
          /**
           * ${description}
           */
          ${functionName}(req: ${requestBodyTypeName}, listener: (error: Error | null, response: ${responseTypeName} | null) => void): void {
            return driver.onSubscribed("${subscriptionName}", req, listener)
          },
        `;
      },
      {} as any
    );

    const sdk = pipe(
      replaceAll("Scaffolded", pascalCase(schema.appName)),
      replaceAll(
        "    /* operations */",
        [...queries, ...subscriptions].join(`\n`)
      )
    )(
      await fs.readFile(
        path.join(__dirname, "../src/__scaffolds__/makeScaffoldedBridge.ts"),
        "utf-8"
      )
    );

    lines.push(sdk);

    const output = lines.join(`\n`);

    return prettier.format(output, {
      parser: "babel-ts",
    });
  },
};

function replaceAll(from: string, to: string) {
  return (str: string) => str.split(from).join(to);
}

export default plugin;
