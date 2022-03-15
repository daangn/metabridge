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
    "@metabridge/plugin-swift",
    "--schema",
    "./test/schema.json",
    "--output",
    "./test/schema.output.swift",
  ].join(" ");

  await exec.promise(command, true);

  const output = await fs.readFile(
    path.resolve("./test/schema.output.swift"),
    "utf-8"
  );

  assert.equal(
    output,
    dedent`
      // This file was generated from JSON Schema using quicktype, do not modify it directly.
      // To parse the JSON, add this file to your project and do:
      //
      //   let myAppBridgeSchema = try MyAppBridgeSchema(json)
      
      import Foundation
      
      enum MyAppBridgeSchema {
          case anythingArray([Any?])
          case bool(Bool)
          case double(Double)
          case integer(Int)
          case myAppBridgeSchemaClass(MyAppBridgeSchemaClass)
          case string(String)
          case null
      }
      
      // MARK: - MyAppBridgeSchemaClass
      struct MyAppBridgeSchemaClass {
          let storageGetRequestBody: StorageGetRequestBody
          let storageGetResponse: StorageGetResponse
      }
      
      // MARK: - StorageGetRequestBody
      struct StorageGetRequestBody {
          let key: String
      }
      
      // MARK: - StorageGetResponse
      struct StorageGetResponse {
          let value: String
      }
    ` + "\n"
  );
})();
