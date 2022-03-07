export interface MetaBridgeDriver {
  onCalled: (type: string, requestBody: any) => Promise<any>;
}

export function makeScaffoldedBridge<T extends MetaBridgeDriver>({
  driver,
}: {
  driver: T;
}) {
  return {
    driver,
    /* operations */
  };
}
