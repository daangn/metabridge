import { camelCase, pascalCase } from "change-case";
import {
  FetchingJSONSchemaStore,
  InputData,
  JSONSchemaInput,
  quicktype,
  SwiftTargetLanguage,
} from "quicktype-core";

import { Plugin } from "@metabridge/plugin-base";

const plugin: Plugin = {
  async compile(schema) {
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

    const schemaInput = new JSONSchemaInput(new FetchingJSONSchemaStore());
    const schemaRootTypeName = pascalCase(schema.appName + " BridgeSchema");

    await schemaInput.addSource({
      name: schemaRootTypeName,
      schema: JSON.stringify({
        properties,
        additionalProperties: false,
        required: Object.keys(properties),
        $defs: schema.$defs,
      }),
    });

    const inputData = new InputData();
    inputData.addInput(schemaInput);

    const lang = new SwiftTargetLanguage();

    const typeDefs = await quicktype({
      inputData,
      lang,
      rendererOptions: {
        "struct-or-class": "class",
        initializers: "true",
      },
    });

    const enumLines = [];

    enumLines.push(`enum ${schemaRootTypeName}QueryName: String {`);
    enumLines.push("  case undefined");
    for (const queryName of Object.keys(schema.queries)) {
      enumLines.push(`  case ${camelCase(queryName)} = "${queryName}"`);
    }
    enumLines.push("}");
    enumLines.push("");

    if (Object.keys(schema.subscriptions ?? {}).length > 0) {
      enumLines.push(`enum ${schemaRootTypeName}SubscriptionName: String {`);
      enumLines.push("  case undefined");
      for (const subscriptionName of Object.keys(schema.subscriptions ?? {})) {
        enumLines.push(
          `  case ${camelCase(subscriptionName)} = "${subscriptionName}"`
        );
      }
      enumLines.push("}");
    }

    return [...typeDefs.lines, ...enumLines].join(`\n`) + "\n";
  },
};

export default plugin;
