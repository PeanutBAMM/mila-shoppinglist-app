import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  fullyParallel: false, // Set to false for better stability
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1, // Add retry for local tests
  workers: 1, // Single worker for stability
  timeout: 60000, // 60 second timeout for tests
  
  // Enhanced reporting
  reporter: [
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
    ['json', { outputFile: 'test-results/results.json' }],
    ['list', { printSteps: true }]
  ],
  
  use: {
    baseURL: 'http://localhost:8082',
    trace: 'on-first-retry',
    actionTimeout: 30000, // 30 second timeout for actions
    
    // Screenshot and video settings
    screenshot: {
      mode: 'only-on-failure',
      fullPage: true
    },
    video: {
      mode: 'retain-on-failure',
      size: { width: 1280, height: 720 }
    },
    
    // Viewport for mobile testing
    viewport: { width: 390, height: 844 }, // iPhone 14 size
    
    // Dutch locale
    locale: 'nl-NL',
    timezoneId: 'Europe/Amsterdam',
  },

  projects: [
    {
      name: 'mobile-chromium',
      use: { 
        ...devices['iPhone 14'],
        locale: 'nl-NL',
      },
    },
    {
      name: 'desktop-chromium',
      use: { 
        ...devices['Desktop Chrome'],
        viewport: { width: 1920, height: 1080 },
        locale: 'nl-NL',
      },
    },
  ],

  webServer: {
    command: 'npm run web:test',
    url: 'http://localhost:8082',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
    stdout: 'pipe',
    stderr: 'pipe',
  },
})