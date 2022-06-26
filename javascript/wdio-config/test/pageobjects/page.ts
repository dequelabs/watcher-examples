export default class Page {
    /**
    * Opens a sub page of the page
    * @param path path of the sub page (e.g. /path/to/page.html)
    */
    public open (url: string, path: string) {
        return browser.url(`${url}/${path}`)
    }
}
