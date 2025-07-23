import fs from "fs/promises";
import { HTMLElement, parse, TextNode } from "node-html-parser";
import { pascalCase } from "change-case";
import path from "path";

import { Plugin } from "@metabridge/plugin-base";

const plugin: Plugin = {
  async compile(schema) {
    const template = await fs.readFile(
      path.join(__dirname, "../template/dist/index.html"),
      "utf-8"
    );

    const root = parse(template);

    const titleText = new TextNode(
      pascalCase(schema.appName + " Bridge"),
      null as any
    );

    const title = new HTMLElement("title", {}, "", null);
    title.appendChild(titleText);

    const scriptText = new TextNode(
      `
        try {
          window.title = \`${titleText}\`;
        } catch (e) {}
        try {
          window.schema = JSON.parse(\`${JSON.stringify(schema).replace(/`/g, "\\`")}\`);
        } catch (e) {}
      `,
      null as any
    );
    const script = new HTMLElement("script", {}, "", null);
    script.appendChild(scriptText);

    const head = root.getElementsByTagName("head")[0];
    head.appendChild(title);
    head.appendChild(script);

    return root.toString();
  },
};

export default plugin;
