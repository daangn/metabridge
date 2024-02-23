import styled from "@emotion/styled";
import React, { useState } from "react";

export default function Copy({ onClick }: { onClick?: () => void }) {
  const [copied, setCopied] = useState(false);

  return (
    <CopyButton
      onClick={() => {
        onClick?.();

        setCopied(true);

        setTimeout(() => {
          setCopied(false);
        }, 2000);
      }}
    >
      {!copied ? (
        <CopyIcon
          role="presentation"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          <path d="M14 1.5H6l-.5.5v2.5h1v-2h7v7h-2v1H14l.5-.5V2l-.5-.5z"></path>
          <path d="M2 5.5l-.5.5v8l.5.5h8l.5-.5V6l-.5-.5H2zm7.5 8h-7v-7h7v7z"></path>
        </CopyIcon>
      ) : (
        <CopiedIcon
          role="presentation"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fillRule="evenodd"
            d="M14.485 4.347l-8.324 8.625-4.648-4.877.724-.69 3.929 4.123 7.6-7.875.72.694z"
          ></path>
        </CopiedIcon>
      )}
    </CopyButton>
  );
}

const CopyButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
`;

const CopyIcon = styled.svg`
  color: rgb(61, 61, 61);
  @media (prefers-color-scheme: dark) {
    color: #e2e8f0;
  }
  fill: currentcolor;
  width: 0.875rem;
  height: 0.875rem;
`;

const CopiedIcon = styled.svg`
  color: rgb(45, 179, 94);
  fill: currentcolor;
  width: 0.875rem;
  height: 0.875rem;
`;
