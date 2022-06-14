import { ITab } from "@karrotframe/tabs";

declare global {
  interface Window {
    customTabs: Array<Omit<ITab, "render">>;
  }
}

export function getCustomTabs() {
  return window.customTabs ?? [];
}
