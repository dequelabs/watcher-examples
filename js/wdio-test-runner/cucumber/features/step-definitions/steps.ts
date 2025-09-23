import {
  Given,
  When,
  Then,
  AfterStep,
  BeforeAll
} from '@wdio/cucumber-framework'
import { expect } from '@wdio/globals'
import LoginPage from '../pageobjects/login.page'
import SecurePage from '../pageobjects/secure.page'
import { WdioController, wrapWdio } from '@axe-core/watcher'

let controller: WdioController

const pages = {
  login: LoginPage
}

BeforeAll(() => {
  controller = new WdioController(browser)
  wrapWdio(browser, controller)
})

Given(/^I am on the (\w+) page$/, async page => {
  // @ts-expect-error Cucumber generated example code
  await pages[page].open()
})

When(/^I login with (\w+) and (.+)$/, async (username, password) => {
  await LoginPage.login(username, password)
})

Then(/^I should see a flash message saying (.*)$/, async message => {
  try {
    await SecurePage.flashAlert.waitForExist({ timeout: 60000 })
  } catch (error) {
    console.error(`Error waiting for flash alert to exist: ${error}`)
  }
  try {
    await SecurePage.flashAlert.waitForDisplayed({ timeout: 60000 })
  } catch (error) {
    console.error(`Error waiting for flash alert to be displayed: ${error}`)
  }

  try {
    await expect(SecurePage.flashAlert).toBeExisting()
  } catch (error) {
    console.error(`Error waiting for flash alert to be existing: ${error}`)
  }
  try {
    await expect(SecurePage.flashAlert).toHaveText(
      expect.stringContaining(message)
    )
  } catch (error) {
    console.error(`Error waiting for flash alert to have text: ${error}`)
  }
})

AfterStep(async () => {
  await controller.flush()
})
