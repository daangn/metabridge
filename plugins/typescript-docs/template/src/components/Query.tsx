import { camelCase } from "change-case";
import { stringify } from "javascript-stringify";
import React, { useReducer, useState } from "react";

import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Form from "@rjsf/chakra-ui";

import { getDriver } from "../driver";
import { getSchema, title } from "../it";
import CodeSnippet from "./CodeSnippet";
import { colors } from "../colors";

const schema = getSchema();

interface QueryProps {
  queryName: string;
}
const Query: React.FC<QueryProps> = (props) => {
  const [isCollapsed, toggleCollapse] = useReducer((t) => !t, true);

  const [requestBody, setRequestBody] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  const onSubmit = async () => {
    const driver = getDriver();
    const response = await driver.onQueried(props.queryName, requestBody);
    setResponse(response);
  };

  const currentQuery = schema.queries[props.queryName];

  return (
    <Container>
      <Top onClick={toggleCollapse}>
        <Title>{props.queryName}</Title>
        <Description>{currentQuery.description}</Description>
        {currentQuery.minimumSupportAppVersion && (
          <MinimumSupportAppVersion>
            <MinimumSupportAppVersionTitle>
              Minimum Support App Version
            </MinimumSupportAppVersionTitle>
            <MinimumSupportAppVersionContent>
              🍎 iOS: {currentQuery.minimumSupportAppVersion.ios}
            </MinimumSupportAppVersionContent>
            <MinimumSupportAppVersionContent>
              🤖 Android: {currentQuery.minimumSupportAppVersion.android}
            </MinimumSupportAppVersionContent>
          </MinimumSupportAppVersion>
        )}
      </Top>
      {!isCollapsed && (
        <Body>
          <BodyRequest>
            <BodyRequestForm>
              <Form
                schema={{
                  ...(currentQuery.requestBody as any),
                  $defs: schema.$defs,
                }}
                formData={requestBody}
                onChange={(e) => {
                  setRequestBody(e.formData);
                }}
                liveValidate
              />
            </BodyRequestForm>
            <BodyRequestSdkCode>
              <CodeSnippet language="typescript">
                {`${camelCase(title)}.${currentQuery.operationId}(${stringify(
                  requestBody,
                  null,
                  2
                )})`}
              </CodeSnippet>
            </BodyRequestSdkCode>
            <BodyFormBottom>
              <Button colorScheme="blue" onClick={onSubmit}>
                Submit
              </Button>
            </BodyFormBottom>
          </BodyRequest>
          {response && (
            <BodyResponse>
              <BodyResponseTitle>RESPONSE</BodyResponseTitle>
              <CodeSnippet language="typescript">
                {stringify(response, null, 2)}
              </CodeSnippet>
            </BodyResponse>
          )}
        </Body>
      )}
    </Container>
  );
};

const Container = styled.div`
  margin-bottom: 0.75rem;
  box-shadow: 0 0 0 1px ${colors.gray200}, 0 2px 0 0 ${colors.gray100};
  border-radius: 0.25rem;
  overflow: hidden;

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 0 0 1px ${colors.gray700};
  }
`;

const Top = styled.div`
  padding: 0.5rem 0.75rem;
  box-shadow: 0 1px 0 0 ${colors.gray200};
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;

  @media (prefers-color-scheme: dark) {
    box-shadow: 0 1px 0 0 ${colors.gray700};
  }
`;

const Title = styled.div`
  font-size: 0.9125rem;
  font-weight: bold;
  color: ${colors.gray900};

  @media (prefers-color-scheme: dark) {
    color: ${colors.gray50};
  }
`;

const Description = styled.div`
  font-size: 0.75rem;
  color: ${colors.gray600};

  @media (prefers-color-scheme: dark) {
    color: ${colors.gray500};
  }
`;

const MinimumSupportAppVersion = styled.div`
  margin-top: .5rem;
`;

const MinimumSupportAppVersionTitle = styled.div`
  font-size: 0.625rem;
  color: ${colors.gray600};
  font-weight: 700;
  text-transform: uppercase;

  @media (prefers-color-scheme: dark) {
    color: ${colors.gray500};
  }
`;

const MinimumSupportAppVersionContent = styled.div`
  font-size: 0.75rem;
  color: ${colors.gray600};

  @media (prefers-color-scheme: dark) {
    color: ${colors.gray500};
  }
`;

const Body = styled.div``;

const BodyRequest = styled.div`
  padding: 0.75rem;
`;

const BodyRequestForm = styled.div`
  color: ${colors.gray900};

  @media (prefers-color-scheme: dark) {
    color: ${colors.gray50};
  }

  hr {
    border-color: ${colors.gray200};

    @media (prefers-color-scheme: dark) {
      border-color: ${colors.gray700};
    }
  }

  form > div:first-of-type > div {
    margin-bottom: 0;
  }
  form > div:last-of-type {
    margin-top: 0;
    display: none;
  }
  h5 {
    font-size: 0.875rem;
    margin-bottom: 0.25rem;
    color: ${colors.gray900};

    @media (prefers-color-scheme: dark) {
      color: ${colors.gray50};
    }
  }
`;

const BodyRequestSdkCode = styled.div`
  padding: 0.75rem;
  box-shadow: 0 0 0 1px ${colors.gray200};
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  background-color: #fff;

  @media (prefers-color-scheme: dark) {
    background-color: #0d1117;
    box-shadow: none;
  }
`;

const BodyFormBottom = styled.div``;

const BodyResponse = styled.div`
  padding: 0.75rem;
`;

const BodyResponseTitle = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  margin-bottom: 0.5rem;
  color: #343a40;

  @media (prefers-color-scheme: dark) {
    color: #343a40;
  }
`;

export default Query;
