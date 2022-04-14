import { camelCase, pascalCase, constantCase } from "change-case";
import {
  FetchingJSONSchemaStore,
  InputData,
  JSONSchemaInput,
  KotlinTargetLanguage,
  quicktype,
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

    const lang = new KotlinTargetLanguage();

    const packageName = camelCase(
      schema.appName + " BridgeSchema"
    ).toLowerCase();

    const typeDefs = await quicktype({
      inputData,
      lang,
      rendererOptions: {
        framework: "kotlinx",
        package: packageName,
      },
    });

    const enumLines = [`object ${schemaRootTypeName}QueryName {`];

    for (const queryName of Object.keys(schema.queries)) {
      enumLines.push(
        `    const val ${constantCase(queryName)} = "${queryName}"`
      );
    }

    enumLines.push("}");

    return [...typeDefs.lines, ...enumLines].join(`\n`) + "\n";
  },
};

export default plugin;
