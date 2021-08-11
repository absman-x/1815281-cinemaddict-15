import { createElement } from '../utils.js';

const createUserRankTemplate = () => (
  `<section class="header__profile profile">
    <p class="profile__rating">Movie buff</p>
    <img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
    </section>`
);

export default class Rank {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createUserRankTemplate();
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
