import assert from "assert";
import dedent from "dedent";
import exec from "exec-sh";
import fs from "fs/promises";
import path from "path";

(async () => {
  const command = [
    "yarn",
    "metabridge-cli",
    "--plugin",
    "@metabridge/plugin-kotlin",
    "--schema",
    "./test/schema.json",
    "--output",
    "./test/schema.output.kt",
  ].join(" ");

  await exec.promise(command, true);

  const output = await fs.readFile(
    path.resolve("./test/schema.output.kt"),
    "utf-8"
  );

  assert.equal(
    output,
    dedent`
      package myappbridgeschema

      sealed class MyAppBridgeSchema {
          class AnythingArrayValue(val value: List<Any?>)                      : MyAppBridgeSchema()
          class BoolValue(val value: Boolean)                                  : MyAppBridgeSchema()
          class DoubleValue(val value: Double)                                 : MyAppBridgeSchema()
          class IntegerValue(val value: Long)                                  : MyAppBridgeSchema()
          class MyAppBridgeSchemaClassValue(val value: MyAppBridgeSchemaClass) : MyAppBridgeSchema()
          class StringValue(val value: String)                                 : MyAppBridgeSchema()
          class NullValue()                                                    : MyAppBridgeSchema()
      }
      
      data class MyAppBridgeSchemaClass (
          val storageGetRequestBody: StorageGetRequestBody,
          val storageGetResponse: StorageGetResponse
      )
      
      data class StorageGetRequestBody (
          val key: String
      )
      
      data class StorageGetResponse (
          val value: String
      )
    ` + "\n"
  );
})();
