import { expect, test } from "@playwright/test";
import { readFileSync } from "node:fs";
import { createServer, type Server } from "node:http";
import type { AddressInfo } from "node:net";

let server: Server;
let url: string;

test.beforeAll(async () => {
  const html = readFileSync("test/schema.output.html");
  server = createServer((req, res) => {
    if (req.url?.endsWith(".js")) {
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.end("");
      return;
    }
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(html);
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  url = `http://127.0.0.1:${(server.address() as AddressInfo).port}/`;
});

test.afterAll(
  () => new Promise<void>((resolve) => server.close(() => resolve()))
);

for (const theme of ["android", "cupertino"] as const) {
  for (const colorScheme of ["light", "dark"] as const) {
    test(`${theme} ${colorScheme}: header and tabs share safe area offsets`, async ({
      browser,
    }) => {
      const context = await browser.newContext({
        viewport: { width: 390, height: 844 },
        colorScheme,
        userAgent:
          theme === "cupertino"
            ? "Mozilla/5.0 (iPhone)"
            : "Mozilla/5.0 (Linux; Android 15)",
      });
      const page = await context.newPage();
      const errors: string[] = [];
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(url);
      await expect(page.locator(".seed-app-bar-main__title")).toHaveText(
        "MyAppBridge"
      );
      for (const inset of [0, 24]) {
        await page.evaluate((value) => {
          document.documentElement.style.setProperty(
            "--seed-safe-area-top",
            `${value}px`
          );
          document.documentElement.style.setProperty(
            "--seed-safe-area-bottom",
            `${value}px`
          );
        }, inset);
        const layout = await page.evaluate(() => {
          const layer = document.querySelector(".seed-app-screen__layer")!;
          const bar = document.querySelector(".seed-app-bar__root")!;
          const tab = layer.firstElementChild!;
          const style = getComputedStyle(layer);
          return {
            headerBottom: bar.getBoundingClientRect().bottom,
            tabTop: tab.getBoundingClientRect().top,
            paddingTop: parseFloat(style.paddingTop),
            paddingBottom: parseFloat(style.paddingBottom),
            colorScheme: document.documentElement.dataset.seedUserColorScheme,
          };
        });
        const headerHeight = theme === "android" ? 56 : 44;
        expect(layout.headerBottom).toBe(inset + headerHeight);
        expect(layout.paddingTop).toBe(inset + headerHeight);
        expect(layout.tabTop).toBe(layout.headerBottom);
        expect(layout.paddingBottom).toBe(inset);
        expect(layout.colorScheme).toBe(colorScheme);
      }
      expect(errors).toEqual([]);
      await context.close();
    });
  }
}

test("preserves query, subscription, custom tab and close integrations", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const state = {
      queries: [] as unknown[],
      subscriptions: [] as unknown[],
      disposed: false,
      closed: false,
      active: false,
    };
    Object.assign(window, {
      playgroundTest: state,
      onClose: () => {
        state.closed = true;
      },
      customTabs: [
        {
          key: "Custom",
          buttonLabel: "Custom",
          onActive: () => {
            state.active = true;
            document.getElementById("customTab-Custom")!.textContent =
              "Custom tab mounted";
          },
        },
      ],
      driver: {
        onQueried: async (name: string, body: unknown) => {
          state.queries.push({ name, body });
          return { value: "stored value" };
        },
        onSubscribed: (
          name: string,
          body: unknown,
          listener: (error: null, value: unknown) => void
        ) => {
          state.subscriptions.push({ name, body });
          listener(null, { data: "event received" });
          return () => {
            state.disposed = true;
          };
        },
      },
    });
  });
  await page.goto(url);
  await page.getByText("STORAGE.GET", { exact: true }).click();
  await page
    .getByRole("textbox", { name: "key", exact: true })
    .fill("test-key");
  await page
    .getByRole("button", { name: "Submit", exact: true })
    .last()
    .click();
  await expect(page.getByText("stored value", { exact: false })).toBeVisible();
  await page.getByText("STREAM.SUBSCRIBE", { exact: true }).click();
  await page
    .getByRole("textbox", { name: "eventName", exact: true })
    .fill("test-event");
  await page.getByRole("button", { name: "Subscribe", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Listening..." })
  ).toBeVisible();
  await page.getByRole("button", { name: "Dispose", exact: true }).click();
  await page.getByText("Custom", { exact: true }).click();
  await expect(page.getByText("Custom tab mounted")).toBeVisible();
  await page.getByRole("button", { name: "Close", exact: true }).click();
  const state = await page.evaluate(() => (window as any).playgroundTest);
  expect(state).toEqual({
    queries: [{ name: "STORAGE.GET", body: { key: "test-key" } }],
    subscriptions: [
      { name: "STREAM.SUBSCRIBE", body: { eventName: "test-event" } },
    ],
    disposed: true,
    closed: true,
    active: true,
  });
});
