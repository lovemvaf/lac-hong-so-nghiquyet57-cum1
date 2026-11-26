import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 90000,
  expect: {
    timeout: 8000
  },
  fullyParallel: false,
  workers: 1,
  reporter: [['list']],
  use: {
    baseURL: 'http://127.0.0.1:5174/lac-hong-so-nghiquyet57-cum1/',
    viewport: { width: 1920, height: 1080 }
  },
  webServer: {
    command: 'npx vite --port 5174 --host 127.0.0.1',
    url: 'http://127.0.0.1:5174/lac-hong-so-nghiquyet57-cum1/',
    reuseExistingServer: !process.env.CI,
    timeout: 20000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    }
  ]
});
