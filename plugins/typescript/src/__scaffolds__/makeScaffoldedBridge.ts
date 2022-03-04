export interface metabridgeDriver {
  onCalled: (type: string, requestBody: any) => Promise<any>;
}

export function makeScaffoldedBridge({ driver }: { driver: metabridgeDriver }) {
  return {
    /* operations */
  };
}
