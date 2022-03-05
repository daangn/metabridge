import React from "react";
import { ChakraProvider } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Navigator, Screen } from "@karrotframe/navigator";
import PageHome from "./pages/PageHome";

const isCupertino = /iphone|ipad|ipod/i.test(navigator.userAgent.toLowerCase());

const App: React.FC = () => {
  return (
    <Container>
      <ChakraProvider>
        <Navigator theme={isCupertino ? "Cupertino" : "Android"}>
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
