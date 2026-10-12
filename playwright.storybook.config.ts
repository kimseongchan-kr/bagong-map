import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  testMatch: "**/*.spec.ts",
  fullyParallel: true,
  workers: 2,
  retries: 0,
  reporter: "list",
  use: {
    browserName: "chromium",
    baseURL: "http://127.0.0.1:6006",
    viewport: { width: 1440, height: 900 },
    screenshot: "only-on-failure",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run storybook -- --ci --disable-telemetry",
    url: "http://127.0.0.1:6006/index.json",
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
  },
});
