import Ajv, { JSONSchemaType } from "ajv";
import { Schema } from "./schema";
import metaSchema from "./schema.json";

const ajv = new Ajv();
const validate = ajv.compile(metaSchema as any as JSONSchemaType<Schema>);

export type TypeSchema = Schema;

export function parse(data: unknown) {
  if (validate(data)) {
    return data;
  }

  throw new Error(`Invalid Schema: ${validate.errors?.toString()}`);
}
