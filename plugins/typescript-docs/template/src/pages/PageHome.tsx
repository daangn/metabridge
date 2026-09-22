import { groupBy } from "lodash";
import React, { useEffect, useMemo, useState } from "react";

import styled from "@emotion/styled";
import { css } from "@emotion/css";
import { CloseIcon } from "@chakra-ui/icons";
import { AppScreen, AppBar } from "@seed-design/stackflow";
import { ITab, Tabs } from "@karrotframe/tabs";

import Query from "../components/Query";
import { getSchema, title } from "../it";
import Subscription from "../components/Subscription";
import { getCustomTabs } from "../customTabs";

const schema = getSchema();

const PageHome: React.FC = () => {
  const groups = groupBy(
    [
      ...Object.keys(schema.queries).map((name) => ({
        _t: "QUERY" as const,
        name,
        ...schema.queries[name],
      })),
      ...Object.keys(schema.subscriptions ?? {}).map((name) => ({
        _t: "SUBSCRIPTION" as const,
        name,
        ...schema.subscriptions?.[name],
      })),
    ],
    ({ tag }) => tag || "Etc"
  );

  const customTabs = useMemo(() => getCustomTabs(), []);

  const [activeTabKey, setActiveTabKey] = useState(Object.keys(groups)[0]);

  return (
    <AppScreen.Root layerOffsetTop="appBar" layerOffsetBottom="safeArea">
      <AppScreen.Dim />
      <AppBar.Root>
        <AppBar.Left>
          <AppBar.IconButton
            aria-label="Close"
            onClick={() => window.onClose?.()}
          >
            <CloseIcon />
          </AppBar.IconButton>
        </AppBar.Left>
        <AppBar.Main>
          <AppBar.Title>{title}</AppBar.Title>
        </AppBar.Main>
      </AppBar.Root>
      <AppScreen.Layer className="playground-screen-content">
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
            tabs={[
              ...Object.entries(groups).map(([tagName, commands]) => ({
                key: tagName,
                buttonLabel: tagName,
                render() {
                  return (
                    <TabMain>
                      {commands.map(({ _t, name }) =>
                        _t === "QUERY" ? (
                          <Query key={name} queryName={name} />
                        ) : (
                          <Subscription key={name} subscriptionName={name} />
                        )
                      )}
                    </TabMain>
                  );
                },
              })),
              ...customTabs.map(
                (tab) =>
                  ({
                    ...tab,
                    render() {
                      return (
                        <CustomTabContent
                          tabKey={tab.key}
                          active={activeTabKey === tab.key}
                          onActive={tab.onActive}
                        />
                      );
                    },
                  } as ITab)
              ),
            ]}
            activeTabKey={activeTabKey}
            onTabChange={(tabKey) => {
              setActiveTabKey(tabKey);
            }}
            useInlineButtons
          />
        </TabsContainer>
      </AppScreen.Layer>
    </AppScreen.Root>
  );
};

// Notify consumers only after the custom tab's mount point exists.
const CustomTabContent: React.FC<{
  tabKey: string;
  active: boolean;
  onActive: () => void;
}> = ({ tabKey, active, onActive }) => {
  useEffect(() => {
    if (active) onActive();
  }, [active, onActive]);

  return <div id={`customTab-${tabKey}`} />;
};

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
