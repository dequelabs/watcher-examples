import Page from './page';

export default class HerokuPage extends Page {
  /**
   * Opens a sub page of the page
   * @param path path of the sub page (e.g. /path/to/page.html)
   */
  public open(path: string) {
    return super.open('https://the-internet.herokuapp.com', path);
  }
}
