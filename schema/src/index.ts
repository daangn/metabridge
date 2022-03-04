import * as z from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const protocol = z.object({
  operationId: z.string(),
  description: z.string(),
  requestBody: z.any(),
  response: z.any(),
});

const schema = z.object({
  protocols: z.record(z.string(), protocol),
  $defs: z.any(),
});

export const jsonSchema = zodToJsonSchema(schema, "nextbridgeSchema");

export type TypeSchema = z.infer<typeof schema>;

export type TypeProtocol = z.infer<typeof protocol>;

export function parse(data: unknown) {
  return schema.parse(data);
}
