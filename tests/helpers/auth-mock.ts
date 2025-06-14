import { Page } from '@playwright/test'

export interface MockUser {
  id: string
  email: string
  full_name: string
  subscription_tier: 'free' | 'trial' | 'premium'
  trial_ends_at?: string
}

export const mockUsers = {
  freeUser: {
    id: 'test-free-user',
    email: 'free@test.com',
    full_name: 'Test Gebruiker',
    subscription_tier: 'free' as const
  },
  trialUser: {
    id: 'test-trial-user',
    email: 'trial@test.com', 
    full_name: 'Trial Gebruiker',
    subscription_tier: 'trial' as const,
    trial_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  premiumUser: {
    id: 'test-premium-user',
    email: 'premium@test.com',
    full_name: 'Premium Gebruiker',
    subscription_tier: 'premium' as const
  }
}

export async function mockAuth(page: Page, user: MockUser) {
  // Mock session data
  const mockSession = {
    access_token: 'mock-access-token',
    refresh_token: 'mock-refresh-token',
    expires_in: 3600,
    expires_at: Date.now() + 3600000,
    token_type: 'bearer',
    user: {
      id: user.id,
      email: user.email,
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
        full_name: user.full_name
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      aud: 'authenticated'
    }
  }

  // CRITICAL: Set auth data BEFORE any page navigation
  await page.addInitScript((data) => {
    const { session, user } = data
    const authKey = 'sb-lfaybrusqgkaxmovyegv-auth-token'
    
    // Create the auth object that Supabase expects
    const authData = {
      currentSession: session,
      expiresAt: Date.now() + 3600000
    }
    
    // Set in localStorage immediately
    window.localStorage.setItem(authKey, JSON.stringify(authData))
    
    // Also set a flag to indicate mock is ready
    window.__AUTH_MOCKED__ = true
  }, { session: mockSession, user })

  // Set up API interceptors BEFORE navigation
  await page.route('**/auth/v1/user', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession.user)
    })
  })

  await page.route('**/auth/v1/session', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(mockSession)
    })
  })

  await page.route('**/rest/v1/profiles*', route => {
    const url = new URL(route.request().url())
    
    // Return profile data
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
    // Check if it's a query for user's lists
    const url = new URL(route.request().url())
    if (url.searchParams.has('user_id')) {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      })
    } else {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([])
      })
    }
  })

  await page.route('**/rest/v1/stores*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: '1', name: 'Albert Heijn', logo_url: null },
        { id: '2', name: 'Jumbo', logo_url: null },
        { id: '3', name: 'Lidl', logo_url: null },
        { id: '4', name: 'PLUS', logo_url: null }
      ])
    })
  })

  await page.route('**/rest/v1/product_suggestions*', route => {
    route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([])
    })
  })
}

// Setup authenticated session and navigate
export async function setupAuthenticatedSession(page: Page, user: MockUser = mockUsers.freeUser) {
  // Mock auth BEFORE navigation
  await mockAuth(page, user)
  
  // Now navigate - should go to home screen
  await page.goto('/')
  
  // Wait for navigation to complete
  // The app should redirect to (tabs) which is the home screen
  await page.waitForURL('**', { timeout: 10000 })
  
  // If we ended up on login, auth failed
  if (page.url().includes('/login')) {
    throw new Error('Authentication failed - redirected to login')
  }
  
  // Wait for home screen to be ready
  // Look for any element that indicates we're on the home screen
  try {
    await page.waitForSelector('[data-testid="home-screen"]', { 
      timeout: 5000,
      state: 'visible' 
    }).catch(() => {
      // Fallback: wait for any text that indicates home screen
      return page.waitForSelector('text=/Hallo|Mijn Lijsten|Zoek producten/', { 
        timeout: 5000 
      })
    })
  } catch (error) {
    console.error('Home screen not loaded properly')
    throw new Error('Home screen did not load after authentication')
  }
}
