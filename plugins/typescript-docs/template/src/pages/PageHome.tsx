import React, { useState } from "react";
import { ScreenHelmet } from "@karrotframe/navigator";
import { Tabs } from "@karrotframe/tabs";
import { getSchema, title } from "../it";
import styled from "@emotion/styled";
import Protocol from "../components/Protocol";

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
                  <Protocols>
                    {Object.keys(schema.protocols).map((key) => (
                      <Protocol key={key} type={key} />
                    ))}
                  </Protocols>
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

const Container = styled.div``;

const TabsContainer = styled.div`
  position: relative;
  top: -1px;
`;

const Protocols = styled.div`
  padding: 1rem;
`;

export default PageHome;
