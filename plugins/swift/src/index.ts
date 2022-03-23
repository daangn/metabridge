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

    return typeDefs.lines.join(`\n`);
  },
};

export default plugin;
