export interface MetaBridgeDriver {
  onQueried: (queryName: string, requestBody: any) => Promise<any>;
}

declare global {
  interface Window {
    driver: MetaBridgeDriver;
  }
}

export function getDriver() {
  return window.driver;
}
