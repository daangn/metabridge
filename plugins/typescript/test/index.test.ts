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
    "@metabridge/plugin-typescript",
    "--schema",
    "./test/schema.json",
    "--output",
    "./test/schema.output.ts",
  ].join(" ");

  await exec.promise(command, true);

  const output = await fs.readFile(
    path.resolve("./test/schema.output.ts"),
    "utf-8"
  );

  assert.equal(
    output,
    dedent`
      /* tslint:disable */
      /**
       * This file was automatically generated by json-schema-to-typescript.
       * DO NOT MODIFY IT BY HAND. Instead, modify the source JSONSchema file,
       * and run json-schema-to-typescript to regenerate this file.
       */
      
      export interface MyAppBridgeSchema {
        StorageGetRequestBody: {
          key: string;
        };
        StorageGetResponse: StringValue;
        StreamSubscribeRequestBody: {
          eventName: string;
          [k: string]: unknown;
        };
        StreamSubscribeResponse: {
          data: string;
          [k: string]: unknown;
        };
      }
      export interface StringValue {
        value: string;
      }
      
      export interface MetaBridgeDriver {
        onQueried: (queryName: string, requestBody: any) => Promise<any>;
        onSubscribed: (
          subscriptionName: string,
          requestBody: any,
          listener: (error: Error | null, response: any | null) => void
        ) => () => void;
      }

      export type BridgeInstance<T> = {
        driver: T;
        /**
         * Get item from persistent storage
         *
         * Minimum Support App Version
         * - iOS 1.1.1
         * - Android 1.1.1
         */
        getItemFromStorage: (
          req: MyAppBridgeSchema["StorageGetRequestBody"]
        ) => Promise<MyAppBridgeSchema["StorageGetResponse"]>;
        /**
         * Subscribe event
         */
        subscribe: (
          req: MyAppBridgeSchema["StreamSubscribeRequestBody"],
          listener: (
            error: Error | null,
            response: MyAppBridgeSchema["StreamSubscribeResponse"] | null
          ) => void
        ) => () => void;
      };
      
      export function makeMyAppBridge<T extends MetaBridgeDriver>({
        driver,
      }: {
        driver: T;
      }): BridgeInstance<T> {
        return {
          driver,
          getItemFromStorage(req) {
            return driver.onQueried("STORAGE.GET", req);
          },
          subscribe(req, listener) {
            return driver.onSubscribed("STREAM.SUBSCRIBE", req, listener);
          },
        };
      }    
    ` + "\n"
  );
})();
