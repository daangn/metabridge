interface CustomTab {
  key: string;
  buttonLabel: string;
  onActive: () => void;
}

declare global {
  interface Window {
    customTabs: Array<CustomTab>;
  }
}

export function getCustomTabs() {
  return window.customTabs ?? [];
}
