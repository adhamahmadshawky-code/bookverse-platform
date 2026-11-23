import { defineConfig } from "@playwright/test";
export default defineConfig({
  testDir: "tests/e2e",
  use: {
    baseURL: "http://localhost:3000",
    headless: true,
    launchOptions: {
      executablePath: "/usr/bin/google-chrome",
      args: ["--no-sandbox"],
    },
  },
  webServer: {
    command: process.env.E2E_PRODUCTION ? "npm run start" : "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000,
  },
  reporter: "list",
});
