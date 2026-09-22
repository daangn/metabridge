import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import { defineConfig } from "@stackflow/config";
import { stackflow } from "@stackflow/react";
import { basicRendererPlugin } from "@stackflow/plugin-renderer-basic";
import { seedPlugin } from "@seed-design/stackflow";

import PageHome from "./pages/PageHome";

const isCupertino = /iphone|ipad|ipod/i.test(navigator.userAgent);

declare global {
  interface Window {
    onClose?: () => void;
  }
}

declare module "@stackflow/config" {
  interface Register {
    Home: {};
  }
}

const { Stack } = stackflow({
  config: defineConfig({
    activities: [{ name: "Home" }],
    initialActivity: () => "Home",
    transitionDuration: 350,
  }),
  components: { Home: PageHome },
  plugins: [
    basicRendererPlugin(),
    seedPlugin({ theme: isCupertino ? "cupertino" : "android" }),
  ],
});

const App: React.FC = () => (
  <ChakraProvider>
    <Stack />
  </ChakraProvider>
);

export default App;
