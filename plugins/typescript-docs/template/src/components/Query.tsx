import { camelCase } from "change-case";
import { stringify } from "javascript-stringify";
import React, { useReducer, useState } from "react";

import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Form from "@rjsf/chakra-ui";

import { getDriver } from "../driver";
import { getSchema, title } from "../it";
import CodeSnippet from "./CodeSnippet";

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

  return (
    <Container>
      <Top onClick={toggleCollapse}>
        <Title>{props.queryName}</Title>
        <Description>{schema.queries[props.queryName].description}</Description>
      </Top>
      {!isCollapsed && (
        <Body>
          <BodyRequest>
            <BodyRequestForm>
              <Form
                schema={{
                  ...(schema.queries[props.queryName].requestBody as any),
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
                {`${camelCase(title)}.${
                  schema.queries[props.queryName].operationId
                }(${stringify(requestBody, null, 2)})`}
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
  box-shadow: 0 0 0 1px #dee2e6, 0 2px 0 0 #f1f3f5;
  border-radius: 0.25rem;
  overflow: hidden;
`;

const Top = styled.div`
  padding: 0.5rem 0.75rem;
  box-shadow: 0 1px 0 0 #f1f3f5;
`;

const Title = styled.div`
  font-size: 0.9125rem;
  font-weight: bold;
  color: #343a40;
`;

const Description = styled.div`
  font-size: 0.75rem;
  color: #495057;
`;

const Body = styled.div``;

const BodyRequest = styled.div`
  padding: 0.75rem;
  box-shadow: 0 1px 0 0 #f1f3f5;
`;

const BodyRequestForm = styled.div`
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
    color: #343a40;
  }
`;

const BodyRequestSdkCode = styled.div`
  padding: 0.75rem;
  box-shadow: 0 0 0 1px #e9ecef;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
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
`;

export default Query;
