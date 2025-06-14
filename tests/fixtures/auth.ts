import { test as base } from '@playwright/test'
import { MockUser, mockUsers } from './auth-mock'

// Extend base test with auth fixtures
export const test = base.extend<{
  authenticatedPage: { page: any, user: MockUser }
}>({
  authenticatedPage: async ({ page }, use) => {
    // Default to free user
    const user = mockUsers.freeUser
    
    // Set up auth before navigation
    await page.addInitScript((mockUser) => {
      // Create session
      const session = {
        access_token: 'mock-token',
        refresh_token: 'mock-refresh',
        expires_in: 3600,
        expires_at: Date.now() + 3600000,
        token_type: 'bearer',
        user: {
          id: mockUser.id,
          email: mockUser.email,
          email_confirmed_at: new Date().toISOString(),
          phone: '',
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: 'authenticated',
          app_metadata: { provider: 'email', providers: ['email'] },
          user_metadata: { full_name: mockUser.full_name },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          aud: 'authenticated'
        }
      }
      
      // Set in localStorage
      const authKey = 'sb-lfaybrusqgkaxmovyegv-auth-token'
      localStorage.setItem(authKey, JSON.stringify({
        currentSession: session,
        expiresAt: Date.now() + 3600000
      }))
    }, user)
    
    // Mock API responses
    await page.route('**/auth/v1/user', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          id: user.id,
          email: user.email,
          email_confirmed_at: new Date().toISOString(),
          phone: '',
          confirmed_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: 'authenticated',
          app_metadata: { provider: 'email', providers: ['email'] },
          user_metadata: { full_name: user.full_name },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          aud: 'authenticated'
        })
      })
    })
    
    await page.route('**/rest/v1/profiles*', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([{
          id: user.id,
          email: user.email,
          full_name: user.full_name,
          subscription_tier: user.subscription_tier,
          trial_ends_at: user.trial_ends_at,
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
    
    await use({ page, user })
  }
})

export { expect } from '@playwright/test'
