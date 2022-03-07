import React, { useState } from "react";

import styled from "@emotion/styled";
import { ScreenHelmet } from "@karrotframe/navigator";
import { Tabs } from "@karrotframe/tabs";

import Query from "../components/Query";
import { getSchema, title } from "../it";

const schema = getSchema();

const PageHome: React.FC = () => {
  const [activeTabKey, setActiveTabKey] = useState("Queries");

  return (
    <Container>
      <ScreenHelmet title={title} />
      <TabsContainer>
        <Tabs
          tabs={[
            {
              key: "Queries",
              buttonLabel: "Queries",
              render() {
                return (
                  <TabMain>
                    {Object.keys(schema.queries).map((key) => (
                      <Query key={key} type={key} />
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
