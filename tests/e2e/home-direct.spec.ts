import { test, expect } from '@playwright/test'

test.describe('Home Screen with Direct Navigation', () => {
  test.beforeEach(async ({ page }) => {
    // Set auth data directly in localStorage before navigation
    const authKey = 'sb-lfaybrusqgkaxmovyegv-auth-token'
    const mockSession = {
      currentSession: {
        access_token: 'mock-access-token',
        refresh_token: 'mock-refresh-token',
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: 'bearer',
        user: {
          id: 'test-user-id',
          email: 'test@test.com',
          email_confirmed_at: new Date().toISOString(),
          phone: '',
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: 'authenticated',
          app_metadata: {
            provider: 'email',
            providers: ['email']
          },
          user_metadata: {
            full_name: 'Test Gebruiker'
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          aud: 'authenticated'
        }
      },
      expiresAt: Date.now() + 3600000
    }
    
    // Mock all required API endpoints
    await page.route('**/auth/v1/user', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(mockSession.currentSession.user)
      })
    })
    
    await page.route('**/rest/v1/profiles*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: 'test-user-id',
          email: 'test@test.com',
          full_name: 'Test Gebruiker',
          subscription_tier: 'free',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }])
      })
    })
    
    await page.route('**/rest/v1/shopping_lists*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      })
    })
    
    // Go to page and inject auth
    await page.goto('/')
    await page.evaluate((data) => {
      const { authKey, mockSession } = data
      localStorage.setItem(authKey, JSON.stringify(mockSession))
    }, { authKey, mockSession })
    
    // Navigate to tabs (home)
    await page.goto('/(tabs)')
    
    // Wait for either home screen or error
    try {
      await page.waitForSelector('[data-testid="home-screen"]', { timeout: 5000 })
    } catch {
      // Fallback: wait for any home screen indicator
      await page.waitForSelector('text=/Hallo|Mijn Lijsten/', { timeout: 5000 })
    }
  })
  
  test('should display welcome message', async ({ page }) => {
    // Check for greeting
    await expect(page.getByText(/Hallo.*👋/)).toBeVisible()
  })
  
  test('should display date in Dutch', async ({ page }) => {
    // Check for Dutch date format
    const dateRegex = /\w+dag, \d+ \w+/ // e.g., "vrijdag, 13 juni"
    await expect(page.getByText(dateRegex)).toBeVisible()
  })
  
  test('should have search bar', async ({ page }) => {
    const searchInput = page.getByPlaceholder('Zoek producten of recepten...')
    await expect(searchInput).toBeVisible()
  })
  
  test('should display shopping lists section', async ({ page }) => {
    await expect(page.getByText('Mijn Lijsten')).toBeVisible()
  })
  
  test('should show empty state when no lists', async ({ page }) => {
    await expect(page.getByText('Begin met je eerste lijst')).toBeVisible()
    await expect(page.getByText('Maak eerste lijst')).toBeVisible()
  })
})