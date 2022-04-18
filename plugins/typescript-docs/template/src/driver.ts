export interface MetaBridgeDriver {
  onQueried: (queryName: string, requestBody: any) => Promise<any>;
  onSubscribed: (
    subscriptionName: string,
    requestBody: any,
    listener: (response: any) => void
  ) => void;
}

declare global {
  interface Window {
    driver: MetaBridgeDriver;
  }
}

export function getDriver() {
  return window.driver;
}
