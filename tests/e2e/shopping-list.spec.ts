import { test, expect, Page } from '@playwright/test'

// Test data voor Nederlandse UI
const DUTCH_UI = {
  buttons: {
    createList: 'Nieuwe lijst',
    addItem: 'Item toevoegen',
    deleteItem: 'Verwijderen',
    saveList: 'Lijst opslaan',
    cancel: 'Annuleren'
  },
  placeholders: {
    listName: 'Naam van je lijst',
    itemName: 'Wat wil je toevoegen?',
    quantity: 'Aantal'
  },
  messages: {
    listCreated: 'Lijst aangemaakt!',
    itemAdded: 'Item toegevoegd',
    listEmpty: 'Je lijst is nog leeg'
  }
}

test.describe('Shopping List - Free User', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to app and login as free user
    await page.goto('/')
    // Add login logic here when auth is ready
  })

  test('should create a new shopping list', async ({ page }) => {
    // Click create new list button
    await page.getByRole('button', { name: DUTCH_UI.buttons.createList }).click()
    
    // Fill in list name
    await page.getByPlaceholder(DUTCH_UI.placeholders.listName).fill('Weekboodschappen')
    
    // Save the list
    await page.getByRole('button', { name: DUTCH_UI.buttons.saveList }).click()
    
    // Verify success message
    await expect(page.getByText(DUTCH_UI.messages.listCreated)).toBeVisible()
  })

  test('should add items to shopping list', async ({ page }) => {
    // Assume we have a list open
    
    // Add first item
    await page.getByPlaceholder(DUTCH_UI.placeholders.itemName).fill('Melk')
    await page.getByPlaceholder(DUTCH_UI.placeholders.quantity).fill('2')
    await page.getByRole('button', { name: DUTCH_UI.buttons.addItem }).click()
    
    // Verify item was added
    await expect(page.getByText('Melk')).toBeVisible()
    await expect(page.getByText('2')).toBeVisible()
  })

  test('should delete items from list', async ({ page }) => {
    // Add an item first
    await page.getByPlaceholder(DUTCH_UI.placeholders.itemName).fill('Brood')
    await page.getByRole('button', { name: DUTCH_UI.buttons.addItem }).click()
    
    // Delete the item
    await page.locator('[data-testid="delete-Brood"]').click()
    
    // Confirm deletion
    await page.getByRole('button', { name: DUTCH_UI.buttons.deleteItem }).click()
    
    // Verify item is gone
    await expect(page.getByText('Brood')).not.toBeVisible()
  })

  test('should show empty state message', async ({ page }) => {
    // Navigate to empty list
    await expect(page.getByText(DUTCH_UI.messages.listEmpty)).toBeVisible()
  })
})