export interface MetaBridgeDriver {
  onQueried: (queryName: string, requestBody: any) => Promise<any>;
  onSubscribed: (
    subscriptionName: string,
    requestBody: any,
    listener: (response: any) => void
  ) => void;
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
