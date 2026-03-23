import { test, expect } from '@playwright/test'

test.describe('Books CRUD', () => {
  test('shows empty state', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByText('Books')).toBeVisible()
    await expect(page.getByText('No books yet')).toBeVisible()
  })

  test('can add a book', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: 'Add Book' }).click()
    await page.getByLabel(/title/i).fill('The Pragmatic Programmer')
    await page.getByLabel(/author/i).fill('David Thomas')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.getByText('The Pragmatic Programmer')).toBeVisible()
  })

  test('can edit a book', async ({ page }) => {
    await page.goto('/')

    // Add a book
    await page.getByRole('button', { name: 'Add Book' }).click()
    await page.getByLabel(/title/i).fill('Original Title')
    await page.getByLabel(/author/i).fill('Author Name')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.getByText('Original Title')).toBeVisible()

    // Target the Edit button inside the card for this specific book
    const card = page.getByTestId('book-card').filter({ hasText: 'Original Title' })
    await card.getByRole('button', { name: /edit/i }).click()
    await page.getByLabel(/title/i).clear()
    await page.getByLabel(/title/i).fill('Updated Title')
    await page.getByRole('button', { name: /update/i }).click()
    await expect(page.getByText('Updated Title')).toBeVisible()
  })

  test('can delete a book', async ({ page }) => {
    await page.goto('/')

    // Add a book
    await page.getByRole('button', { name: 'Add Book' }).click()
    await page.getByLabel(/title/i).fill('To Be Deleted')
    await page.getByLabel(/author/i).fill('Author')
    await page.getByRole('button', { name: /create/i }).click()
    await expect(page.getByText('To Be Deleted')).toBeVisible()

    // Target the Delete button inside the card for this specific book
    const card = page.getByTestId('book-card').filter({ hasText: 'To Be Deleted' })
    await card.getByRole('button', { name: /delete/i }).click()
    await expect(page.getByText('To Be Deleted')).not.toBeVisible()
  })
})
