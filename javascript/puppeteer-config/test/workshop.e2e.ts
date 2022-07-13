import 'mocha'
import { expect } from 'chai'; 
import Puppeteer from 'puppeteer'
import { puppeteerConfig } from '@deque/watcher'
import { v4 } from 'uuid'

describe('My Login Application', () => {
    let browser: Puppeteer.Browser
    let page: Puppeteer.Page

    const {
        AXE_SERVER_URL = 'http://localhost:3000',
        AXE_WATCHER_API_KEY = 'foobar'
    } = process.env

    if (!AXE_WATCHER_API_KEY) {
        throw new Error('AXE_WATCHER_API_KEY is not defined')
    }

    const AXE_WATCHER_SESSION_ID = v4()

    before(async () => {
        browser = await Puppeteer.launch(puppeteerConfig({
            axe: {
                apiKey: AXE_WATCHER_API_KEY,
                browserId: AXE_WATCHER_SESSION_ID,
                serverURL: AXE_SERVER_URL
            }
        }))

        page = await browser.newPage()
    })
    
    after(async () => {
        // await browser.close()
    })
    
    it('login with valid credentials', async () => {
        await page.goto('https://the-internet.herokuapp.com/login')
        const usernameElement = await page.$('#username')
        const passwordElement = await page.$('#password')
        
        if(!usernameElement) {
            throw ""
        } else if(!passwordElement) {
            throw ""
        }

        await usernameElement.type("tomsmith")
        await passwordElement.type("SuperSecretPassword!")

        const loginButton = await page.$('button[type="submit"]')
        if(!loginButton) {
            throw ""
        }

        await loginButton.click()
        await page.waitForNavigation({timeout: 30000})
        const flashAlert = await page.$('#flash');

        expect(flashAlert).to.be.exist
    })
})
