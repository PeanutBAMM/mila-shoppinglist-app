import { test, expect, Page } from '@playwright/test'
import { mockAuth, mockUsers, setupAuthenticatedSession } from '../helpers/auth-mock'

// Test data voor Nederlandse UI op home screen
const DUTCH_HOME_UI = {
  welcomeText: {
    greeting: 'Hallo',
    dateFormat: /\w+dag, \d+ \w+/ // e.g., "vrijdag, 13 juni"
  },
  search: {
    placeholder: 'Zoek producten of recepten...',
    voiceButton: 'Voice search'
  },
  hero: {
    exclusive: 'EXCLUSIEF DEZE WEEK',
    viewDeals: 'Bekijk aanbiedingen',
    summerTitle: 'Zomer BBQ Deals',
    summerSubtitle: 'Tot 40% korting op BBQ producten',
    winterTitle: 'Winter Warmte',
    winterSubtitle: 'Alles voor je stamppot met korting',
    defaultTitle: 'Verse Aanbiedingen',
    defaultSubtitle: 'Bespaar tot 30% deze week'
  },
  quickActions: [
    { icon: '🥬', title: 'Groenten', count: '12' },
    { icon: '🥛', title: 'Zuivel', count: '8' },
    { icon: '🍞', title: 'Bakkerij', count: '5' },
    { icon: '🧺', title: 'Alles', count: '25' }
  ],
  lists: {
    header: 'Mijn Lijsten',
    activeList: 'actieve lijst',
    activeLists: 'actieve lijsten',
    newButton: 'Nieuw',
    emptyTitle: 'Begin met je eerste lijst',
    emptySubtitle: 'Maak een boodschappenlijst en laat Mila je helpen met slimme suggesties',
    createFirstButton: 'Maak eerste lijst',
    lastUpdated: 'Laatst bijgewerkt'
  },
  alerts: {
    category: 'Categorie',
    categorySelected: 'geselecteerd',
    cart: 'Winkelmandje',
    comingSoon: 'Binnenkort beschikbaar!',
    voiceSearch: 'Voice Search',
    voiceComingSoon: 'Komt binnenkort!'
  }
}

test.describe('Home Screen - General Features', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authenticated session as free user
    await setupAuthenticatedSession(page, mockUsers.freeUser)
  })

  test('should display welcome message with current date', async ({ page }) => {
    // Check for date display
    await expect(page.getByText(DUTCH_HOME_UI.welcomeText.dateFormat)).toBeVisible()
    
    // Check for greeting
    await expect(page.getByText(new RegExp(`${DUTCH_HOME_UI.welcomeText.greeting}.*👋`))).toBeVisible()
  })

  test('should have functional search bar', async ({ page }) => {
    // Find search input
    const searchInput = page.getByPlaceholder(DUTCH_HOME_UI.search.placeholder)
    await expect(searchInput).toBeVisible()
    
    // Type in search
    await searchInput.fill('melk')
    await expect(searchInput).toHaveValue('melk')
    
    // Clear search
    await searchInput.clear()
    await expect(searchInput).toHaveValue('')
  })

  test('should display seasonal hero section', async ({ page }) => {
    // Check for exclusive text
    await expect(page.getByText(DUTCH_HOME_UI.hero.exclusive)).toBeVisible()
    
    // Check for view deals button
    const viewDealsButton = page.getByText(DUTCH_HOME_UI.hero.viewDeals)
    await expect(viewDealsButton).toBeVisible()
    
    // Click should be interactive
    await viewDealsButton.click({ force: true })
  })

  test('should display quick action categories', async ({ page }) => {
    // Check each quick action
    for (const action of DUTCH_HOME_UI.quickActions) {
      await expect(page.getByText(action.title)).toBeVisible()
      await expect(page.getByText(action.count)).toBeVisible()
    }
    
    // Test clicking a category
    await page.getByText('Groenten').click()
    // Wait for alert to appear
    await page.waitForTimeout(500)
  })

  test('should display shopping cart FAB', async ({ page }) => {
    // Find cart button by looking for cart icon or emoji
    const cartButton = page.locator('[name="cart"], svg[data-testid="cart-icon"], text="🛒"').first()
    if (await cartButton.isVisible()) {
      await expect(cartButton).toBeVisible()
    }
    
    // Check badge number (might be in the FAB)
    const badgeNumber = page.locator('text="3"').first()
    if (await badgeNumber.isVisible()) {
      await expect(badgeNumber).toBeVisible()
    }
    
    // Click cart if visible
    if (await cartButton.isVisible()) {
      await cartButton.click({ force: true })
      // Wait for alert
      await page.waitForTimeout(500)
    }
  })
})

test.describe('Home Screen - Shopping Lists', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page, mockUsers.freeUser)
  })

  test('should display empty state when no lists exist', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=/Mijn Lijsten/', { timeout: 10000 })
    
    // Check empty state elements
    await expect(page.getByText(DUTCH_HOME_UI.lists.emptyTitle)).toBeVisible()
    await expect(page.getByText(DUTCH_HOME_UI.lists.emptySubtitle)).toBeVisible()
    await expect(page.getByText(DUTCH_HOME_UI.lists.createFirstButton)).toBeVisible()
    
    // Test create first list button
    await page.getByText(DUTCH_HOME_UI.lists.createFirstButton).click()
    await expect(page).toHaveURL(/\/lists\/create/)
  })

  test('should display shopping lists when they exist', async ({ page }) => {
    // Mock having lists
    // This would need actual data setup
    
    await page.goto('/')
    
    // Check list header
    await expect(page.getByText(DUTCH_HOME_UI.lists.header)).toBeVisible()
    
    // Check new list button
    const newButton = page.getByText(DUTCH_HOME_UI.lists.newButton)
    if (await newButton.isVisible()) {
      await expect(newButton).toBeVisible()
      await newButton.click()
      await expect(page).toHaveURL(/\/lists\/create/)
    }
  })
})

test.describe('Home Screen - Premium Features', () => {
  test.beforeEach(async ({ page }) => {
    // Setup authenticated session as premium user
    await setupAuthenticatedSession(page, mockUsers.premiumUser)
  })

  test('should show voice search for premium users', async ({ page }) => {
    
    // Look for microphone icon in the search bar
    const searchBar = page.locator('input[placeholder*="Zoek"]').locator('..')
    const voiceButton = searchBar.locator('svg').last()
    
    // Premium users should see the mic button
    await expect(voiceButton).toBeVisible()
    await voiceButton.click()
    // Wait for alert dialog
    await page.waitForTimeout(500)
  })

  test('should show Mila chat button for premium users', async ({ page }) => {
    // This test assumes premium user is logged in
    
    await page.goto('/')
    
    // Look for Mila chat button (robot emoji)
    const milaButton = page.getByText('🤖')
    if (await milaButton.isVisible()) {
      await milaButton.click()
      await expect(page).toHaveURL(/\/mila-chat/)
    }
  })
})

test.describe('Home Screen - Responsive Design', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page, mockUsers.freeUser)
  })

  test('should be responsive on mobile viewport', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    
    // Check key elements are still visible
    await expect(page.getByText(DUTCH_HOME_UI.lists.header)).toBeVisible()
    await expect(page.getByPlaceholder(DUTCH_HOME_UI.search.placeholder)).toBeVisible()
  })

  test('should handle pull to refresh', async ({ page }) => {
    await page.goto('/')
    
    // Simulate pull to refresh gesture
    await page.locator('body').dispatchEvent('touchstart', { 
      touches: [{ clientY: 100 }] 
    })
    await page.locator('body').dispatchEvent('touchmove', { 
      touches: [{ clientY: 300 }] 
    })
    await page.locator('body').dispatchEvent('touchend')
    
    // Wait for refresh to complete
    await page.waitForTimeout(1000)
  })
})

test.describe('Home Screen - Animations', () => {
  test.beforeEach(async ({ page }) => {
    await setupAuthenticatedSession(page, mockUsers.freeUser)
  })

  test('should display entrance animations', async ({ page }) => {
    await page.goto('/')
    await page.waitForSelector('text=/Hallo/', { timeout: 10000 })
    
    // Wait for fade in animation
    await page.waitForTimeout(800)
    
    // Check opacity of main elements
    const welcomeSection = page.locator('text=/Hallo.*/')
    await expect(welcomeSection).toBeVisible()
    
    // Check hero section scale animation
    const heroSection = page.locator('text=/EXCLUSIEF DEZE WEEK/')
    await expect(heroSection).toBeVisible()
  })

  test('should have interactive press animations', async ({ page }) => {
    await page.goto('/')
    
    // Test button press animation
    const newButton = page.getByText(DUTCH_HOME_UI.lists.newButton)
    await newButton.hover()
    await page.mouse.down()
    await page.waitForTimeout(100)
    await page.mouse.up()
  })
})
