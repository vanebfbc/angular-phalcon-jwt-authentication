import { CielInventoryPage } from './app.po';

describe('ciel-inventory App', () => {
  let page: CielInventoryPage;

  beforeEach(() => {
    page = new CielInventoryPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!');
  });
});
