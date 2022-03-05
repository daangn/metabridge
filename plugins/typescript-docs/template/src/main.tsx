import "@karrotframe/navigator/index.css";
import "@karrotframe/tabs/index.css";
import "highlight.js/styles/github.css";
import "./main.css";

import hljs from "highlight.js";
import json from "highlight.js/lib/languages/json";
import typescript from "highlight.js/lib/languages/typescript";
import React from "react";
import ReactDOM from "react-dom";

import App from "./App";

hljs.registerLanguage("json", json);
hljs.registerLanguage("typescript", typescript);
hljs.configure({});

ReactDOM.render(<App />, document.getElementById("root"));
