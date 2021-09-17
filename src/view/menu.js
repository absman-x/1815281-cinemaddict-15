import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const createFilterItemTemplate = (filter, currentFilterType) => {
  const { type, name, count } = filter;
  return (
    `<a href="#${type}"
    class="main-navigation__item
    ${type === currentFilterType ? 'main-navigation__item--active' : ''}">
    ${name}
    ${type !== FilterType.ALL ? ` <span class="main-navigation__item-count">${count}</span>` : ''}
    </a>`);
};

const createMenuTemplate = (filterItems, currentFilterType) => {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');

  return (
    `<nav class="main-navigation">
      <div class="main-navigation__items">
      ${filterItemsTemplate}
      </div>
      <a href="#stats" class="main-navigation__additional">Stats</a>
    </nav>`);
};

export default class Menu extends AbstractView {
  constructor(filters, currentFilterType) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilterType;

    this._filterTypeChangeHandler = this._filterTypeChangeHandler.bind(this);
  }

  getTemplate() {
    return createMenuTemplate(this._filters, this._currentFilter);
  }

  _filterTypeChangeHandler(evt) {
    evt.preventDefault();
    if (evt.target.tagName !== 'A') {
      return;
    }
    this._callback.filterTypeChange(evt.target.href.split('#').pop());
  }

  setFilterTypeChangeHandler(callback) {
    this._callback.filterTypeChange = callback;
    this.getElement().addEventListener('click', this._filterTypeChangeHandler);
  }
}
