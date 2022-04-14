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
    const properties = Object.entries(schema.queries).reduce(
      (acc, [queryName, { requestBody, response }]) => {
        return {
          ...acc,
          [pascalCase(queryName + " RequestBody")]: requestBody,
          [pascalCase(queryName + " Response")]: response,
        };
      },
      {} as any
    );

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

    const enumLines = [
      `enum ${schemaRootTypeName}QueryName: String {`,
      "  case undefined",
    ];

    for (const queryName of Object.keys(schema.queries)) {
      enumLines.push(`  case ${camelCase(queryName)} = "${queryName}"`);
    }

    enumLines.push("}");

    return [...typeDefs.lines, ...enumLines].join(`\n`) + "\n";
  },
};

export default plugin;
