# metabridge

## Usage

```bash
# Install CLI
$ yarn add --dev @metabridge/cli @metabridge/plugin-typescript

# Generate code
$ yarn metabridge-cli \
$   --plugin @metabridge/plugin-typescript \
$   --schema ./somewhere/mySchema.json \
$   --output ./somewhere/__generated__/mySdk.ts
```

```typescript
import { makeMyBridge } from "./somewhere/__generated__/mySdk";

const myBridge = makeMyBridge({
  driver: {
    onQueried(queryName, req) {
      // ...your business logic for transport layer
      return res;
    },
  },
});

// It strictly typed
myBridge.pushRouter({
  // ...
});
```

## Available Plugins

- `@metabridge/plugin-typescript`: TypeScript SDK
- `@metabridge/plugin-typescript-docs`: TypeScript SDK Documentations (for WebView)
- `@metabridge/plugin-kotlin`: Kotlin Stub
- `@metabridge/plugin-swift`: Swift Stub

## How to implement the JavaScript `Driver`

Just implement this

```typescript
export interface MetaBridgeDriver {
  onQueried: (queryName: string, requestBody: any) => Promise<any>;
  onSubscribed: (
    subscriptionName: string,
    requestBody: any,
    listener: (error: Error | null, response: any | null) => void
  ) => () => void;
}
```

## Contributors

- [@tonyfromundefined](https://github.com/tonyfromundefined)

## Releases

Packages are versioned independently with Changesets. Add a changeset to each PR
that changes a published package:

```sh
yarn changeset
```

After merging to `main`, `.github/workflows/release.yml` opens or updates a
`chore: release packages` PR. It includes package versions, changelogs, and the
Yarn lockfile/PnP state. Merge that PR to publish. The workflow builds and tests
packages before packing them, then publishes the packed artifacts in a separate
job using npm trusted publishing (OIDC). No npm token secret is required.
`workflow_dispatch` can retry a failed release from `main`; already published
versions are skipped. The repository root is private and is never published.

### Initial repository setup

- Enable **Settings → Actions → General → Allow GitHub Actions to create and
  approve pull requests** so Changesets can maintain its release PR.
- In each public `@metabridge/*` package's npm Settings, add a GitHub Actions
  trusted publisher with owner `daangn`, repository `metabridge`, workflow filename
  `release.yml`, environment `npm`, and **Allow npm publish** enabled.
- The `npm` GitHub environment is used only by the publishing job. Restrict its
  deployment branches to `main` in repository settings.
- npm requires a matching `repository.url`; package manifests include this
  metadata. The workflow uses GitHub-hosted runners, Node 22.14 for build/browser checks
  (Yarn 4.8 PnP compatibility), and Node 24 with npm 11 for publishing.

The release PR is created with `GITHUB_TOKEN`, so GitHub does not automatically
trigger PR workflows for that bot-generated commit. The release workflow repeats
build, type, and browser checks before packing; CI can also be run manually on the
release branch before merging. Normal contributor PRs run CI automatically.

See [Changesets automation](https://changesets.dev/guide/automating) and
[npm trusted publishers](https://docs.npmjs.com/trusted-publishers/).
