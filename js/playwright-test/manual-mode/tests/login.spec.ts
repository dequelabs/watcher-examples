import { test, expect } from './fixtures'

/*
    Let's see the number of page states calculation.
    As auto-analyze is false, it will not analyze automatically.

    We first navigate to the page.
    Then we analyze the page. (+1)
    Then we fill the form.
    Then Turn on auto-analyze.
    Then we click the submit button (+1)
    Then we wait for the element to appear.
    Then we analyze the page. (+1)
    So, the total number of page states calculation should be 3.

*/

test.describe('Login page', () => {
  test('should login', async ({ page }) => {
    await page.goto('https://the-internet.herokuapp.com/login')

    /* Analyze after navigation to the page */
    await page.axeWatcher.analyze()

    await page.locator('#username').fill('tomsmith')
    await page.locator('#password').fill('SuperSecretPassword!')

    /* starts auto-analyze to true */
    await page.axeWatcher.start()

    await page.locator('button[type="submit"]').click()
    const flash = await page.waitForSelector('#flash')

    /* stops auto-analyze */
    await page.axeWatcher.stop()

    /* Analyze after form submission */
    await page.axeWatcher.analyze()

    await expect(flash).not.toBeNull()
  })
})
