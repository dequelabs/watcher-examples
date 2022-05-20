import HomeWorkshopPage from  '../pageobjects/home.workshop.page';

describe('Recipe Application', () => {
    it('should display the home page', async () => {
        await HomeWorkshopPage.open();

        await expect(HomeWorkshopPage.card).toHaveTextContaining(
            'Chocolate Cake');
        expect(await HomeWorkshopPage.cards).toHaveLength(8);
    });
    it('should display the edit dialog when it pops up, and close it', async () => {
        await HomeWorkshopPage.open();
        await HomeWorkshopPage.cardEdit.click();
        await expect(HomeWorkshopPage.editDialog).toBeExisting();
        await HomeWorkshopPage.cardEditClose.click();
        await expect(HomeWorkshopPage.editDialog).not.toBeExisting();
    });
    it('should display the cook dialog when it pops up, and close it', async () => {
        await HomeWorkshopPage.open();
        await HomeWorkshopPage.cardCook.click();
        await expect(HomeWorkshopPage.cookDialog).toBeExisting();
        await HomeWorkshopPage.cardCookClose.click();
        await expect(HomeWorkshopPage.cookDialog).not.toBeExisting();
    });
});


