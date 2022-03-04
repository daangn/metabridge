import { TypeSchema } from "@metabridge/schema";

export type Compile = (schema: TypeSchema) => Promise<string>;

export type Plugin = {
  compile: Compile;
};
