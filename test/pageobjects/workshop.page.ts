import Page from './page';

export default class WorkshopPage extends Page {
     public open () {
        return super.open('https://broken-workshop.dequelabs.com', '');
    }
}
