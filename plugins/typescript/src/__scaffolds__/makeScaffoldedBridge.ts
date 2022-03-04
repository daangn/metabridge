export interface NextBridgeDriver {
  onCalled: (type: string, requestBody: any) => Promise<any>;
}

export function makeScaffoldedBridge({ driver }: { driver: NextBridgeDriver }) {
  return {
    /* operations */
  };
}
