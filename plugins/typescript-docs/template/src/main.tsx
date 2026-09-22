import "@seed-design/css/base.css";
import "@seed-design/css/recipes/app-screen.css";
import "@seed-design/css/recipes/app-bar.css";
import "@seed-design/css/recipes/app-bar-main.css";
import "@karrotframe/tabs/index.css";
import "./main.css";
import "./highlight.js/styles/github";
import "./highlight.js/styles/github-dark";

import hljs from "highlight.js";
import json from "highlight.js/lib/languages/json";
import typescript from "highlight.js/lib/languages/typescript";
import React from "react";
import { createRoot } from "react-dom/client";

import App from "./App";

hljs.registerLanguage("json", json);
hljs.registerLanguage("typescript", typescript);
hljs.configure({});

const colorScheme = window.matchMedia("(prefers-color-scheme: dark)");
const updateColorScheme = () => {
  document.documentElement.dataset.seedUserColorScheme = colorScheme.matches
    ? "dark"
    : "light";
};
updateColorScheme();
colorScheme.addEventListener("change", updateColorScheme);

createRoot(document.getElementById("root")!).render(<App />);
