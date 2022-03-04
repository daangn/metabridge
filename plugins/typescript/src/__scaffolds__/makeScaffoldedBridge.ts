export interface MetaBridgeDriver {
  onCalled: (type: string, requestBody: any) => Promise<any>;
}

export function makeScaffoldedBridge({ driver }: { driver: MetaBridgeDriver }) {
  return {
    /* operations */
  };
}
