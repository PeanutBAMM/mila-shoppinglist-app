import { test, expect } from '@playwright/test'

test.describe('Basic App Loading', () => {
  test('should load login page', async ({ page }) => {
    // Navigate to app
    await page.goto('/')
    
    // Should redirect to login
    await page.waitForURL('**/login', { timeout: 10000 })
    
    // Check login page elements
    await expect(page.getByText('Inloggen')).toBeVisible()
    await expect(page.getByPlaceholder('future@mila.nl')).toBeVisible()
    await expect(page.getByText('Login to the Future')).toBeVisible()
  })
  
  test('should have Dutch UI on login page', async ({ page }) => {
    await page.goto('/login')
    
    // Check all Dutch texts
    await expect(page.getByText('Welkom bij Mila')).toBeVisible()
    await expect(page.getByText('De toekomst van boodschappen')).toBeVisible()
    await expect(page.getByText('E-mailadres')).toBeVisible()
    await expect(page.getByText('Wachtwoord', { exact: true })).toBeVisible()
    await expect(page.getByText('Onthoud mij')).toBeVisible()
    await expect(page.getByText('Wachtwoord vergeten?')).toBeVisible()
    await expect(page.getByText('Continue with Google')).toBeVisible()
    await expect(page.getByText('Nieuw bij Mila?')).toBeVisible()
    await expect(page.getByText('Start je reis hier →')).toBeVisible()
    await expect(page.getByText('30 DAGEN GRATIS PREMIUM AI')).toBeVisible()
  })
})