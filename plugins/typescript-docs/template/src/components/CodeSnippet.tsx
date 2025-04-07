import hljs from "highlight.js";
import React, { useEffect, useRef } from "react";

import styled from "@emotion/styled";

interface CodeSnippetProps {
  language: "json" | "typescript";
}
const CodeSnippet: React.FC<CodeSnippetProps> = (props) => {
  const codeRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (codeRef.current) {
      hljs.highlightBlock(codeRef.current);

      return () => {
        delete codeRef.current?.dataset.highlighted;
      }
    }
  }, [codeRef, props.children]);

  return (
    <Code ref={codeRef} className={`language-${props.language}`}>
      {props.children}
    </Code>
  );
};

const Code = styled.code`
  display: block;
  white-space: pre;
  overflow-x: scroll;
  font-size: 0.875rem;

  &::-webkit-scrollbar {
    display: none;
  }
`;

export default CodeSnippet;
