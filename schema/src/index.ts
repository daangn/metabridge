export interface Schema {
  protocols: {
    [type: string]: Protocol;
  };
  components?: any;
}

export interface Protocol {
  operationId: string;
  description: string;
  requestBody: any;
  response: any;
}
