import { createElement } from '../utils.js';

const createFooterMovieCountTemplate = (cardList) => (
  `<p>${cardList.length} movies inside</p>`
);

export default class Footer {
  constructor(cardList) {
    this._cardList = cardList;
    this._element = null;
  }

  getTemplate() {
    return createFooterMovieCountTemplate(this._cardList);
  }

  getElement() {
    if (!this._element) {
      this._element = createElement(this.getTemplate());
    }
    return this._element;
  }

  removeElement() {
    this._element = null;
  }
}
