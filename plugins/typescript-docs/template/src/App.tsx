import React from "react";

import { ChakraProvider } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { Navigator, Screen } from "@karrotframe/navigator";

import PageHome from "./pages/PageHome";

const isCupertino = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());

declare global {
  interface Window {
    onClose?: () => void;
  }
}

const App: React.FC = () => {
  return (
    <Container>
      <ChakraProvider>
        <Navigator
          className={css`
            @media (prefers-color-scheme: dark) {
              --kf_navigator_backgroundColor: #17171a;
              --kf_navigator_dimBackgroundColor: rgba(255, 255, 255, 0.15);
              --kf_navigator_navbar-iconColor: #eaebee;
              --kf_navigator_navbar-borderColor: rgba(255, 255, 255, 0.07);
              --kf_navigator_navbar-center-textColor: #eaebee;
            }
          `}
          theme={isCupertino ? "Cupertino" : "Android"}
          onClose={window.onClose}
        >
          <Screen path="/" component={PageHome} />
        </Navigator>
      </ChakraProvider>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
`;

export default App;
