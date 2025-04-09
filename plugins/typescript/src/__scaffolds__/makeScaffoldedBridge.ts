export interface MetaBridgeDriver {
  onQueried: (queryName: string, requestBody: any) => Promise<any>;
  onSubscribed: (
    subscriptionName: string,
    requestBody: any,
    listener: (
      error: ScaffoldedBridgeError | null,
      response: any | null
    ) => void
  ) => () => void;
}

export class ScaffoldedBridgeError extends Error {
  override name = "ScaffoldedBridgeError";
  readonly reason: string;

  constructor(reason: string, debugDescription?: string) {
    super(debugDescription);
    this.reason = reason;
  }

  static isScaffoldedBridgeError(
    error: unknown
  ): error is ScaffoldedBridgeError {
    return (
      error !== null &&
      typeof error === "object" &&
      "name" in error &&
      typeof error.name === "string" &&
      "reason" in error &&
      typeof error.reason === "string" &&
      "message" in error &&
      typeof error.message === "string"
    );
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
