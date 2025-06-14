import { test, expect } from '@playwright/test'

const TEST_URL = 'http://localhost:8082' // Test server port

test.describe('Login Screen Tests', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to login page before each test
    await page.goto(`${TEST_URL}/auth/login`)
  })

  test('should display login form with Dutch text', async ({ page }) => {
    // Check title
    await expect(page.getByText('Mila')).toBeVisible()
    await expect(page.getByText('Jouw slimme boodschappen assistent')).toBeVisible()

    // Check form labels
    await expect(page.getByText('E-mailadres')).toBeVisible()
    await expect(page.getByText('Wachtwoord')).toBeVisible()
    
    // Check buttons
    await expect(page.getByRole('button', { name: 'Inloggen' })).toBeVisible()
    await expect(page.getByText('Doorgaan met Google')).toBeVisible()
    
    // Check links
    await expect(page.getByText('Wachtwoord vergeten?')).toBeVisible()
    await expect(page.getByText('Registreer nu')).toBeVisible()
  })

  test('should show validation errors for empty fields', async ({ page }) => {
    // Click login without filling fields
    await page.getByRole('button', { name: 'Inloggen' }).click()

    // Check validation messages
    await expect(page.getByText('E-mailadres is verplicht')).toBeVisible()
    await expect(page.getByText('Wachtwoord is verplicht')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    // Enter invalid email
    await page.fill('input[placeholder="jouw@email.nl"]', 'invalid-email')
    await page.fill('input[placeholder="••••••••"]', 'password123')
    await page.getByRole('button', { name: 'Inloggen' }).click()

    // Check validation message
    await expect(page.getByText('Ongeldig e-mailadres')).toBeVisible()
  })

  test('should validate password length', async ({ page }) => {
    // Enter valid email but short password
    await page.fill('input[placeholder="jouw@email.nl"]', 'test@example.com')
    await page.fill('input[placeholder="••••••••"]', '12345')
    await page.getByRole('button', { name: 'Inloggen' }).click()

    // Check validation message
    await expect(page.getByText('Wachtwoord moet minimaal 6 karakters zijn')).toBeVisible()
  })

  test('should handle login with wrong credentials', async ({ page }) => {
    // Fill in wrong credentials
    await page.fill('input[placeholder="jouw@email.nl"]', 'wrong@email.com')
    await page.fill('input[placeholder="••••••••"]', 'wrongpassword')
    await page.getByRole('button', { name: 'Inloggen' }).click()

    // Wait for error message
    await expect(page.getByText('Onjuist e-mailadres of wachtwoord')).toBeVisible({ timeout: 10000 })
  })

  test('should toggle remember me checkbox', async ({ page }) => {
    // Check that checkbox is initially unchecked
    const checkbox = page.locator('text=Onthoud mij').locator('..')
    await expect(checkbox.locator('div').first()).not.toHaveClass(/bg-primary/)

    // Click checkbox
    await checkbox.click()

    // Check that it's now checked
    await expect(checkbox.locator('div').first()).toHaveClass(/bg-primary/)
  })

  test('should navigate to register page', async ({ page }) => {
    // Click register link
    await page.getByText('Registreer nu').click()

    // Check navigation
    await expect(page).toHaveURL(/.*auth\/register/)
  })

  test('should navigate to forgot password page', async ({ page }) => {
    // Click forgot password link
    await page.getByText('Wachtwoord vergeten?').click()

    // Check navigation
    await expect(page).toHaveURL(/.*auth\/forgot-password/)
  })

  test('should show loading state during login', async ({ page }) => {
    // Fill in credentials
    await page.fill('input[placeholder="jouw@email.nl"]', 'test@example.com')
    await page.fill('input[placeholder="••••••••"]', 'password123')

    // Click login
    await page.getByRole('button', { name: 'Inloggen' }).click()

    // Check for loading spinner (briefly visible)
    const button = page.getByRole('button', { name: 'Inloggen' })
    await expect(button).toBeDisabled()
  })

  test('should show Google login alert', async ({ page }) => {
    // Set up dialog handler
    page.on('dialog', async dialog => {
      expect(dialog.type()).toBe('alert')
      expect(dialog.message()).toContain('Google login wordt binnenkort toegevoegd!')
      await dialog.accept()
    })

    // Click Google login button
    await page.getByText('Doorgaan met Google').click()
  })
})
