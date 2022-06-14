import { ITab } from "@karrotframe/tabs";

declare global {
  interface Window {
    customTabs: ITab[];
  }
}

export function getCustomTabs() {
  return window.customTabs ?? [];
}
