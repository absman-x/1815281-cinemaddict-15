import AbstractView from './abstract.js';

const createFooterMovieCountTemplate = (cardList) => (
  `<p>${cardList.length} movies inside</p>`
);

export default class Footer extends AbstractView {
  constructor(cardList) {
    super();
    this._cardList = cardList;
  }

  getTemplate() {
    return createFooterMovieCountTemplate(this._cardList);
  }
}
