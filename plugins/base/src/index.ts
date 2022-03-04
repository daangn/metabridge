import { TypeSchema } from "@nextbridge/schema";

export type Compile = (schema: TypeSchema) => string;

export type Plugin = {
  compile: Compile;
};
