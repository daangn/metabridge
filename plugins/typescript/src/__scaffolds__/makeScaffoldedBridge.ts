export interface MetaBridgeDriver {
  onQueried: (queryName: string, requestBody: any) => Promise<any>;
  onSubscribed: (
    subscriptionName: string,
    requestBody: any,
    listener: (error: Error | null, response: any | null) => void
  ) => () => void;
}

export class ScaffoldedBridgeError extends Error {
  readonly reason: string;
  override name = "ScaffoldedBridgeError";

  constructor(reason: string, debugDescription?: string) {
    super(debugDescription);
    this.reason = reason;
  }
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
