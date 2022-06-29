import HerokuPage from './heroku.page'

/**
 * sub page containing specific selectors and methods for a specific page
 */
class SecurePage extends HerokuPage {
  /**
   * define selectors using getter methods
   */
  public get flashAlert() {
    return $('#flash')
  }
}

export default new SecurePage()
