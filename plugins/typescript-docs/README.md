# TypeScript bridge playground

The generated playground uses Stackflow 2 with SEED AppScreen and AppBar.
Android and Cupertino layouts share the same safe area offsets: the content
starts below the app bar plus the top inset, and reserves the bottom inset.
The template keeps the existing schema-driven forms, tabs, driver injection,
custom tab mount points, and `window.onClose` callback.

Use Node.js 22 and the repository's Yarn version for development:

```sh
yarn install --immutable
yarn build
yarn workspace @metabridge/plugin-typescript-docs template:typecheck
yarn workspace @metabridge/plugin-typescript-docs playwright install chromium
yarn workspace @metabridge/plugin-typescript-docs test:browser
```

Browser tests exercise the generated single-file HTML in Android/Cupertino
and light/dark themes, with zero and nonzero safe area offsets. They also verify
query submission, subscription disposal, custom tab activation, and closing.
The browser tests simulate safe area CSS variables; actual WebView inset
delivery should also be checked on an edge-to-edge Android host.

Consumers need a published version of this plugin and must regenerate their
playground HTML to receive the new layout.
