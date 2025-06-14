// Test data en helpers voor Mila app tests

export const TEST_USERS = {
  freeUser: {
    email: 'free@test.nl',
    password: 'Test123!',
    subscription: 'free'
  },
  premiumUser: {
    email: 'premium@test.nl',
    password: 'Test123!',
    subscription: 'premium'
  },
  trialUser: {
    email: 'trial@test.nl',
    password: 'Test123!',
    subscription: 'trial'
  }
}

export const TEST_SHOPPING_LISTS = {
  weekly: {
    name: 'Weekboodschappen',
    items: [
      { name: 'Melk', quantity: 2, unit: 'pak' },
      { name: 'Brood', quantity: 1, unit: 'brood' },
      { name: 'Kaas', quantity: 500, unit: 'gram' },
      { name: 'Appels', quantity: 6, unit: 'stuks' }
    ]
  },
  party: {
    name: 'Feestje',
    items: [
      { name: 'Chips', quantity: 3, unit: 'zakken' },
      { name: 'Cola', quantity: 2, unit: 'flessen' },
      { name: 'Bier', quantity: 1, unit: 'krat' }
    ]
  }
}

export const DUTCH_CATEGORIES = {
  dairy: 'Zuivel',
  bakery: 'Bakkerij',
  produce: 'Groente & Fruit',
  meat: 'Vlees',
  beverages: 'Dranken',
  snacks: 'Snacks',
  household: 'Huishouden'
}

export const STORES = {
  ah: {
    name: 'Albert Heijn',
    id: 'ah-centrum-utrecht'
  },
  jumbo: {
    name: 'Jumbo',
    id: 'jumbo-noord'
  }
}

// Helper functions
export async function loginUser(page: any, user: typeof TEST_USERS.freeUser) {
  await page.goto('/auth/login')
  await page.getByPlaceholder('E-mailadres').fill(user.email)
  await page.getByPlaceholder('Wachtwoord').fill(user.password)
  await page.getByRole('button', { name: 'Inloggen' }).click()
  await page.waitForURL('/')
}

export async function createShoppingList(page: any, listName: string) {
  await page.getByRole('button', { name: 'Nieuwe lijst' }).click()
  await page.getByPlaceholder('Naam van je lijst').fill(listName)
  await page.getByRole('button', { name: 'Lijst opslaan' }).click()
}