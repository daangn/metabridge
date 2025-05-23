export interface MetaBridgeDriver {
  onQueried: (
    queryName: string,
    requestBody: any,
    schemaInfo: any
  ) => Promise<any>;
  onSubscribed: (
    subscriptionName: string,
    requestBody: any,
    listener: (error: Error | null, response: any | null) => void
  ) => () => void;
}

declare global {
  interface Window {
    driver: MetaBridgeDriver;
  }
}

export function getDriver() {
  return window.driver;
}
