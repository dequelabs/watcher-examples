import HomeWorkshopPage from '../pageobjects/home.workshop.page'

const { DEBUG } = process.env

export const sleep = (override?: number): Promise<void> => {
  const ms = 1001
  return new Promise(r => setTimeout(r, override || ms))
}

const sleepTwenty = (): Promise<void> => {
  return sleep(DEBUG ? 20000 : 0)
}

describe('Recipe Application', () => {
  it('should display the home page', async () => {
    await HomeWorkshopPage.open()
    await sleepTwenty()

    await expect(HomeWorkshopPage.card).toHaveTextContaining('Chocolate Cake')
    await sleepTwenty()
    expect(await HomeWorkshopPage.cards).toHaveLength(8)
  })
  it('should display the edit dialog when it pops up, and close it', async () => {
    await HomeWorkshopPage.open()
    await sleepTwenty()
    await HomeWorkshopPage.cardEdit.click()
    await expect(HomeWorkshopPage.editDialog).toBeExisting()
    await HomeWorkshopPage.cardEditClose.click()
    await sleepTwenty()
    await expect(HomeWorkshopPage.editDialog).not.toBeExisting()
  })
  it('should display the cook dialog when it pops up, and close it', async () => {
    await HomeWorkshopPage.open()
    await sleepTwenty()
    await HomeWorkshopPage.cardCook.click()
    await expect(HomeWorkshopPage.cookDialog).toBeExisting()
    await HomeWorkshopPage.cardCookClose.click()
    await sleepTwenty()
    await expect(HomeWorkshopPage.cookDialog).not.toBeExisting()
  })
})
