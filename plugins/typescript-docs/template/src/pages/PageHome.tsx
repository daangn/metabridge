import React, { useState } from "react";

import styled from "@emotion/styled";
import { ScreenHelmet } from "@karrotframe/navigator";
import { Tabs } from "@karrotframe/tabs";

import Protocol from "../components/Protocol";
import { getSchema, title } from "../it";

const schema = getSchema();

const PageHome: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState("Protocols");

  return (
    <Container>
      <ScreenHelmet title={title} />
      <TabsContainer>
        <Tabs
          tabs={[
            {
              key: "Protocols",
              buttonLabel: "Protocols",
              render() {
                return (
                  <TabMain>
                    {Object.keys(schema.protocols).map((key) => (
                      <Protocol key={key} type={key} />
                    ))}
                  </TabMain>
                );
              },
            },
          ]}
          activeTabKey={activeTabKey}
          onTabChange={(tabKey) => {
            setActiveTabKey(tabKey);
          }}
          useInlineButtons
        />
      </TabsContainer>
    </Container>
  );
};

const Container = styled.div`
  height: 100%;
  overflow: hidden;
`;

const TabsContainer = styled.div`
  height: 100%;
  overflow: hidden;
`;

const TabMain = styled.div`
  padding: 1rem;
  overflow-y: scroll;
  height: 100%;
`;

export default PageHome;
