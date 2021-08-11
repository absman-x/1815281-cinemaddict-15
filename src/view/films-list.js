import { createElement } from '../utils.js';

const createFilmsContainerTemplate = () => '<div class="films-list__container">';

export default class FilmsList {
  constructor() {
    this._element = null;
  }

  getTemplate() {
    return createFilmsContainerTemplate();
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
