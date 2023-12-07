export interface MetaBridgeDriver {
  onQueried: (queryName: string, requestBody: any) => Promise<any>;
  onSubscribed: (
    subscriptionName: string,
    requestBody: any,
    listener: (error: Error | null, response: any | null) => void
  ) => () => void;
}

export type BridgeInstance<T> = {
  driver: T;
  /* definitions */
};

export function makeScaffoldedBridge<T extends MetaBridgeDriver>({
  driver,
}: {
  driver: T;
}): BridgeInstance<T> {
  return {
    driver,
    /* operations */
  };
}
