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
      // To parse the JSON, install kotlin's serialization plugin and do:
      //
      // val json              = Json(JsonConfiguration.Stable)
      // val myAppBridgeSchema = json.parse(MyAppBridgeSchema.serializer(), jsonString)
      
      package myappbridgeschema
      
      import kotlinx.serialization.*
      import kotlinx.serialization.json.*
      import kotlinx.serialization.descriptors.*
      import kotlinx.serialization.encoding.*
      
      @Serializable
      sealed class MyAppBridgeSchema {
          class AnythingArrayValue(val value: JsonArray)                       : MyAppBridgeSchema()
          class BoolValue(val value: Boolean)                                  : MyAppBridgeSchema()
          class DoubleValue(val value: Double)                                 : MyAppBridgeSchema()
          class IntegerValue(val value: Long)                                  : MyAppBridgeSchema()
          class MyAppBridgeSchemaClassValue(val value: MyAppBridgeSchemaClass) : MyAppBridgeSchema()
          class StringValue(val value: String)                                 : MyAppBridgeSchema()
          class NullValue()                                                    : MyAppBridgeSchema()
      }
      
      @Serializable
      data class MyAppBridgeSchemaClass (
          @SerialName("StorageGetRequestBody")
          val storageGetRequestBody: StorageGetRequestBody,
      
          @SerialName("StorageGetResponse")
          val storageGetResponse: StorageGetResponse
      )
      
      @Serializable
      data class StorageGetRequestBody (
          val key: String
      )
      
      @Serializable
      data class StorageGetResponse (
          val value: String
      )
    ` + "\n"
  );
})();
