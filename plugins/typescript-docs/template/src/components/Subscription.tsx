import { camelCase } from "change-case";
import { stringify } from "javascript-stringify";
import React, { useReducer, useRef, useState } from "react";
import dedent from "dedent";

import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import Form from "@rjsf/chakra-ui";

import { getDriver } from "../driver";
import { getSchema, title } from "../it";
import CodeSnippet from "./CodeSnippet";
import { colors } from "../colors";
import Copy from "./Copy";

const schema = getSchema();

interface SubscriptionProps {
  subscriptionName: string;
}
const Subscription: React.FC<SubscriptionProps> = (props) => {
  const [isCollapsed, toggleCollapse] = useReducer((t) => !t, true);
  const [isSubscribed, setIsSubscribed] = useState(false);

  const [requestBody, setRequestBody] = useState<any>(null);
  const [responses, setResponses] = useState<any[]>([]);

  const disposerRef = useRef<() => void>();

  const onSubscribe = async () => {
    if (isSubscribed) {
      return;
    }

    setIsSubscribed(true);
    setResponses([]);

    const driver = getDriver();

    disposerRef.current = driver.onSubscribed(
      props.subscriptionName,
      requestBody,
      (error, response) => {
        if (error) {
          // DO NOTHING...
        }
        if (response) {
          setResponses((prevResponses) => [...prevResponses, response]);
        }
      }
    );
  };

  const onDispose = () => {
    if (!isSubscribed) {
      return;
    }

    disposerRef.current?.();

    setIsSubscribed(false);
  };

  const currentSubscription = schema.subscriptions?.[props.subscriptionName];

  const formattedResponses = responses.map(
    (response) => stringify(response, null, 2) + "\n"
  );

  return (
    <Container>
      <Top onClick={toggleCollapse}>
        <Title>{props.subscriptionName}</Title>
        <Description>{currentSubscription?.description}</Description>
        {currentSubscription?.minimumSupportAppVersion && (
          <MinimumSupportAppVersion>
            <MinimumSupportAppVersionTitle>
              Minimum Support App Version
            </MinimumSupportAppVersionTitle>
            <MinimumSupportAppVersionContent>
              🍎 iOS: {currentSubscription.minimumSupportAppVersion.ios}
            </MinimumSupportAppVersionContent>
            <MinimumSupportAppVersionContent>
              🤖 Android: {currentSubscription.minimumSupportAppVersion.android}
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
                  ...(currentSubscription?.requestBody as any),
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
                {dedent`${camelCase(title)}.${
                  currentSubscription?.operationId
                }(${stringify(requestBody, null, 2)}, (error, response) => {
                  console.log(response)
                })`}
              </CodeSnippet>
            </BodyRequestSdkCode>
            <BodyFormBottom>
              {isSubscribed ? (
                <>
                  <Button colorScheme="gray" disabled marginRight="1">
                    Listening...
                  </Button>
                  <Button colorScheme="orange" onClick={onDispose}>
                    Dispose
                  </Button>
                </>
              ) : (
                <Button colorScheme="blue" onClick={onSubscribe}>
                  Subscribe
                </Button>
              )}
            </BodyFormBottom>
          </BodyRequest>
          {responses.length > 0 && (
            <BodyResponse>
              <BodyResponseTitleArea>
                <BodyResponseTitle>RESPONSES</BodyResponseTitle>
                <Copy
                  onClick={async () => {
                    await navigator.clipboard.writeText(
                      formattedResponses.join("")
                    );
                  }}
                />
              </BodyResponseTitleArea>
              <CodeSnippet language="typescript">
                {formattedResponses}
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
  margin-top: 0.5rem;
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

const BodyResponseTitleArea = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const BodyResponseTitle = styled.div`
  font-size: 0.875rem;
  font-weight: bold;
  margin-right: 0.5rem;
  color: #343a40;

  @media (prefers-color-scheme: dark) {
    color: #343a40;
  }
`;

export default Subscription;
