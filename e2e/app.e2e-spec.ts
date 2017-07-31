import { FunvotePage } from './app.po';

describe('funvote App', () => {
  let page: FunvotePage;

  beforeEach(() => {
    page = new FunvotePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
