import { test, expect } from '@playwright/test'

// Premium feature UI teksten
const PREMIUM_UI = {
  features: {
    voiceInput: 'Spraak invoer',
    aiSuggestions: 'Mila suggesties',
    smartCategorization: 'Slimme categorieën',
    storeOptimization: 'Winkel route'
  },
  mila: {
    greeting: 'Hoi! Ik ben Mila 👋',
    suggestion: 'Misschien heb je ook deze items nodig:',
    savings: 'Je hebt deze week €',
    celebration: 'Goed bezig! 🎉'
  },
  buttons: {
    tryPremium: 'Premium proberen',
    activateVoice: 'Activeer spraak',
    askMila: 'Vraag Mila'
  }
}

test.describe('Premium Features', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Login as premium/trial user
    // TODO: Add premium user auth
  })

  test('should show Mila AI assistant for premium users', async ({ page }) => {
    // Verify Mila greeting is visible
    await expect(page.getByText(PREMIUM_UI.mila.greeting)).toBeVisible()
    
    // Check for AI features
    await expect(page.getByRole('button', { name: PREMIUM_UI.buttons.askMila })).toBeVisible()
  })

  test('should provide AI suggestions when adding items', async ({ page }) => {
    // Start adding an item
    await page.getByPlaceholder('Wat wil je toevoegen?').fill('Melk')
    
    // Wait for Mila suggestions
    await expect(page.getByText(PREMIUM_UI.mila.suggestion)).toBeVisible()
    
    // Should see related suggestions
    await expect(page.getByText('Yoghurt')).toBeVisible()
    await expect(page.getByText('Kaas')).toBeVisible()
  })

  test('should have voice input option', async ({ page }) => {
    // Check voice button is present
    const voiceButton = page.getByRole('button', { name: PREMIUM_UI.buttons.activateVoice })
    await expect(voiceButton).toBeVisible()
    
    // Click voice button
    await voiceButton.click()
    
    // Should show recording indicator
    await expect(page.locator('[data-testid="voice-recording"]')).toBeVisible()
  })

  test('should celebrate savings', async ({ page }) => {
    // Navigate to savings section
    await page.getByRole('tab', { name: 'Besparingen' }).click()
    
    // Should show savings amount
    await expect(page.getByText(PREMIUM_UI.mila.savings)).toBeVisible()
    
    // Should show celebration
    await expect(page.getByText(PREMIUM_UI.mila.celebration)).toBeVisible()
  })

  test('should optimize store route', async ({ page }) => {
    // Open a shopping list
    await page.getByText('Weekboodschappen').click()
    
    // Click store optimization
    await page.getByRole('button', { name: PREMIUM_UI.features.storeOptimization }).click()
    
    // Should show optimized route
    await expect(page.getByText('Optimale route:')).toBeVisible()
    await expect(page.locator('[data-testid="store-map"]')).toBeVisible()
  })
})