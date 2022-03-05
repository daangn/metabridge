import { TypeSchema } from "@metabridge/schema";
import sampleSchema from "../../test/schema.json";

declare global {
  interface Window {
    title: string;
    schema: TypeSchema | undefined;
  }
}

export const { title, schema } = window;

export function getSchema() {
  if (!schema) {
    return sampleSchema as TypeSchema;
  }

  return schema;
}
