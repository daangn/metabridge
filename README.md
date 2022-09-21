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
