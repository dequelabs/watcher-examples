import HomeWorkshopPage from '../pageobjects/home.workshop.page'
import { WdioController } from '@axe-core/watcher'

describe('Recipe Application', () => {
  let controller: WdioController

  before(() => {
    // initialize the axe Watcher controller
    controller = new WdioController(browser)
  })

  afterEach(async () => {
    // ensure that all the axe Watcher test results are flushed out
    await controller.flush()
  })

  it('should display the home page', async () => {
    await HomeWorkshopPage.open()

    await expect(HomeWorkshopPage.card).toHaveTextContaining('Chocolate Cake')
    expect(await HomeWorkshopPage.cards).toHaveLength(8)
  })
  it('should display the edit dialog when it pops up, and close it', async () => {
    await HomeWorkshopPage.open()

    await HomeWorkshopPage.cardEdit.click()
    await expect(HomeWorkshopPage.editDialog).toBeExisting()

    await HomeWorkshopPage.cardEditClose.click()
    await expect(HomeWorkshopPage.editDialog).not.toBeExisting()
  })
  it('should display the cook dialog when it pops up, and close it', async () => {
    await HomeWorkshopPage.open()

    await HomeWorkshopPage.cardCook.click()
    await expect(HomeWorkshopPage.cookDialog).toBeExisting()

    await HomeWorkshopPage.cardCookClose.click()
    await expect(HomeWorkshopPage.cookDialog).not.toBeExisting()
  })

  it('should display the home page (manual mode)', async () => {
    // Stop automatic axe analysis
    await controller.stop()

    await HomeWorkshopPage.open()
    await expect(HomeWorkshopPage.card).toHaveTextContaining('Chocolate Cake')

    await controller.analyze()

    expect(await HomeWorkshopPage.cards).toHaveLength(8)

    // Restart automatic axe analysis
    await controller.start()
  })
})
