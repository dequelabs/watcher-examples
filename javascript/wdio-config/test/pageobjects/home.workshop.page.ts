import WorkshopPage from './workshop.page';

/**
 * sub page containing specific selectors and methods for a specific page
 */
class HomeWorkshopPage extends WorkshopPage {
  /**
   * define selectors using getter methods
   */
  public get card() {
    console.log($('.Recipes__card'));
    return $('.Recipes__card');
  }

  public get cards() {
    return $$('.Recipes__card');
  }

  public get cardEdit() {
    return $('.Recipes__card-head [tabindex="0"]');
  }

  public get editDialog() {
    return $('.RecipeModal');
  }

  public get cardEditClose() {
    return $('.dqpl-close');
  }

  public get cardCook() {
    return $('.dqpl-button-primary');
  }

  public get cookDialog() {
    return $('.RecipeModal');
  }

  public get cardCookClose() {
    return $('.dqpl-close');
  }

  /**
   * overwrite specific options to adapt it to page object
   */
  public open() {
    return super.open();
  }
}

export default new HomeWorkshopPage();
