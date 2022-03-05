import React, { useReducer, useState } from "react";
import styled from "@emotion/styled";
import { getSchema } from "../it";
import Form from "@rjsf/chakra-ui";

const schema = getSchema();

interface ProtocolProps {
  type: string;
}
const Protocol: React.FC<ProtocolProps> = (props) => {
  const [isCollapsed, toggleCollapse] = useReducer((t) => !t, true);

  const [requestBody, setRequestBody] = useState<any>(null);
  const [response, setResponse] = useState<any>(null);

  return (
    <Container>
      <Top onClick={toggleCollapse}>
        <Title>{props.type}</Title>
        <Description>{schema.protocols[props.type].description}</Description>
      </Top>
      {!isCollapsed && (
        <Body>
          <BodyForm>
            <Form
              schema={{
                ...(schema.protocols[props.type].requestBody as any),
                $defs: schema.$defs,
              }}
              formData={requestBody}
              onSubmit={(e) => {
                console.log(e.formData);
                setResponse({ hello: "world" });
              }}
              onChange={(e) => {
                setRequestBody(e.formData);
              }}
            />
          </BodyForm>
          {requestBody && (
            <BodySdkCode>{JSON.stringify(requestBody)}</BodySdkCode>
          )}
          {response && <BodyResponse>{JSON.stringify(response)}</BodyResponse>}
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

const BodyForm = styled.div`
  box-shadow: 0 1px 0 0 #f1f3f5;
  padding: 1rem;

  form > div:first-of-type > div {
    margin-bottom: 0;
  }
  form > div:last-of-type {
    margin-top: 0;
  }
  h5 {
    font-size: 1rem;
    margin-bottom: 0.25rem;
  }
`;

const BodySdkCode = styled.div`
  padding: 1rem;
  box-shadow: 0 1px 0 0 #f1f3f5;
`;

const BodyResponse = styled.div`
  padding: 1rem;
`;

export default Protocol;
