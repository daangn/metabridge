import { groupBy } from "lodash";
import React, { useState } from "react";

import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { ScreenHelmet } from "@karrotframe/navigator";
import { Tabs } from "@karrotframe/tabs";

import Query from "../components/Query";
import { getSchema, title } from "../it";

const schema = getSchema();

const PageHome: React.FC = () => {
  const queryGroups = groupBy(
    Object.keys(schema.queries).map((queryName) => {
      return {
        queryName,
        ...schema.queries[queryName],
      };
    }),
    ({ tag }) => tag || "Etc"
  );

  const [activeTabKey, setActiveTabKey] = useState(Object.keys(queryGroups)[0]);

  return (
    <Container>
      <ScreenHelmet title={title} noBorder />
      <TabsContainer>
        <Tabs
          className={css`
            @media (prefers-color-scheme: dark) {
              --kf_tabs_tabBar-backgroundColor: #17171a;
              --kf_tabs_tabBar-borderColor: rgba(255, 255, 255, 0.07);
              --kf_tabs_tabBar-baseFontColor: #868b94;
              --kf_tabs_tabBar-activeFontColor: #eaebee;
              --kf_tabs_tabBar-indicator-color: #eaebee;
              --kf_tabs_tabMain-backgroundColor: #17171a;
            }
          `}
          tabs={Object.entries(queryGroups).map(([tagName, queries]) => ({
            key: tagName,
            buttonLabel: tagName,
            render() {
              return (
                <TabMain>
                  {queries.map(({ queryName }) => (
                    <Query key={queryName} queryName={queryName} />
                  ))}
                </TabMain>
              );
            },
          }))}
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
