# metabridge

## Usage

```bash
# Install dependencies
$ yarn add --dev @metabridge/cli

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
    onCalled(type, req) {
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
