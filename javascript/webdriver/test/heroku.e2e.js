const { assert } = require('chai')
const { Builder, By, until } = require('selenium-webdriver')
const {
  webdriverConfig,
  WebdriverManualController
} = require('@axe-core/watcher')
const path = require('path')
require('dotenv').config({
  path: path.join(__dirname, '..', '..', '..', '.env')
})

const { AXE_SERVER_URL, AXE_WATCHER_API_KEY } = process.env

if (!AXE_WATCHER_API_KEY) {
  throw new Error('AXE_WATCHER_API_KEY is not defined')
}

describe('My Login Application', () => {
  let driver
  let manualController

  before(async () => {
    driver = await new Builder()
      .forBrowser('chrome')
      .setChromeOptions(
        webdriverConfig({
          axe: {
            apiKey: AXE_WATCHER_API_KEY,
            serverURL: AXE_SERVER_URL
          }
        })
      )
      .build()

    // initialize the axe Watcher manual controller
    manualController = new WebdriverManualController(driver)
  })

  after(async () => {
    await driver.quit()
  })

  describe('Automatic Analysis', function () {
    it('should login with valid credentials', async () => {
      await driver.get('https://the-internet.herokuapp.com/login')

      await driver.findElement(By.css('#username')).sendKeys('tomsmith')
      await driver
        .findElement(By.css('#password'))
        .sendKeys('SuperSecretPassword!')
      await driver.findElement(By.css('button[type="submit"]')).click()
      await driver.wait(until.elementLocated(By.css('#flash')), 1000)

      // "You logged into a secure area!" element
      const isLoggedIn = await driver
        .findElement(By.css('#flash'))
        .isDisplayed()

      assert.isTrue(isLoggedIn)
    })
  })

  describe('Manual Mode', function () {
    it('should login with valid credentials', async () => {
      // Stop automatic axe analysis
      await manualController.stop()

      await driver.get('https://the-internet.herokuapp.com/login')

      await manualController.analyze()

      await driver.findElement(By.css('#username')).sendKeys('tomsmith')
      await driver
        .findElement(By.css('#password'))
        .sendKeys('SuperSecretPassword!')
      await driver.findElement(By.css('button[type="submit"]')).click()
      await driver.wait(until.elementLocated(By.css('#flash')), 1000)

      await manualController.analyze()

      // Restart automatic axe analysis
      await manualController.start()

      // "You logged into a secure area!" element
      const isLoggedIn = await driver
        .findElement(By.css('#flash'))
        .isDisplayed()

      assert.isTrue(isLoggedIn)
    })
  })
})
