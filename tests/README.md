# 🧪 Mila App - Test Structure

## 📁 Folder Structure

```
mila/
├── tests/                      # All test files
│   ├── e2e/                   # End-to-end tests
│   │   ├── auth.spec.ts       # Authentication flows
│   │   ├── shopping-list.spec.ts # Shopping list features
│   │   └── premium-features.spec.ts # Premium functionality
│   └── fixtures/              # Test data and helpers
│       └── test-data.ts       # Reusable test data
├── test-results/              # Test outputs (git-ignored)
├── playwright-report/         # HTML reports (git-ignored)
└── playwright.config.ts       # Playwright configuration
```

## 🚀 Running Tests

```bash
# Run all tests
npm test

# Run specific test file
npx playwright test tests/e2e/shopping-list.spec.ts

# Run tests in UI mode (recommended for development)
npx playwright test --ui

# Run tests with specific project
npx playwright test --project=mobile-chromium

# Generate HTML report
npx playwright show-report
```

## 📝 Writing New Tests

### 1. Use Test Fixtures
```typescript
import { TEST_USERS, loginUser } from '../fixtures/test-data'

test.beforeEach(async ({ page }) => {
  await loginUser(page, TEST_USERS.premiumUser)
})
```

### 2. Always Test Dutch UI
```typescript
// Use Dutch text in selectors
await page.getByRole('button', { name: 'Nieuwe lijst' }).click()

// Store UI text in constants
const DUTCH_UI = {
  buttons: {
    save: 'Opslaan',
    cancel: 'Annuleren'
  }
}
```

### 3. Test Both Free and Premium
```typescript
test.describe('Feature X', () => {
  test.describe('Free User', () => {
    // Test manual features
  })
  
  test.describe('Premium User', () => {
    // Test AI-assisted features
  })
})
```

## 🎯 Generic Templates

Find reusable test templates in:
`C:\Users\peanu\Development\Claude-Dev-Hub\Templates\PlaywrightTests\`

- `auth-flow.template.ts` - Authentication testing
- `dutch-ui-checks.template.ts` - Dutch language validation
- `crud-operations.template.ts` - Generic CRUD testing

## 📊 Test Reports

After running tests, view results:
- Console: Immediate feedback
- HTML Report: `npx playwright show-report`
- JSON Results: `test-results/results.json`
- Screenshots: `test-results/` (on failure)
- Videos: `test-results/` (on failure)

## 🔍 Debugging Tests

```bash
# Run in debug mode
npx playwright test --debug

# Run with headed browser
npx playwright test --headed

# Slow down execution
npx playwright test --slow-mo=1000
```

## ✅ Best Practices

1. **Keep tests independent** - Each test should run in isolation
2. **Use data-testid** - For reliable element selection
3. **Test user journeys** - Not just individual features
4. **Mobile-first** - Default viewport is iPhone 14
5. **Dutch locale** - All tests run with nl-NL locale
6. **Clean up** - Tests should clean up their data

## 🚨 Common Issues

### Tests timing out?
- Increase timeout in config
- Check if dev server is running
- Verify selectors are correct

### Elements not found?
- Use Playwright Inspector: `npx playwright test --debug`
- Check if element is in viewport
- Wait for element: `await page.waitForSelector()`

### Flaky tests?
- Add explicit waits: `await page.waitForLoadState('networkidle')`
- Use more specific selectors
- Check for race conditions