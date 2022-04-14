import { TypeSchema } from "@metabridge/schema";

import sampleSchema from "../../test/schema.json";

declare global {
  interface Window {
    title: string | undefined;
    schema: TypeSchema | undefined;
  }
}

export const { title = "MyApp Bridge" } = window;

export function getSchema() {
  if (!window.schema) {
    return sampleSchema as TypeSchema;
  }

  return window.schema;
}
