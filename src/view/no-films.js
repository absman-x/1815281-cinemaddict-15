import { createElement } from '../utils.js';

const FILTERS = {
  ALL_MOVIES: 'All movies',
  WATCHLIST: 'Watchlist',
  HISTORY: 'History',
  FAVORITES: 'Favorites',
};

const allMoviesFilter = {
  text: 'There are no movies in our database',
};

const watchlistFilter = {
  text: 'There are no movies to watch now',
};

const historyFilter = {
  text: 'There are no watched movies now',
};

const favoritesFilter = {
  text: 'There are no favorite movies now',
};

const createNoFilmsTemplate = (filter) => {
  let titleText;
  let titleClass;
  switch (filter) {
    case (FILTERS.ALL_MOVIES):
      titleText = allMoviesFilter.text;
      titleClass ='';
      break;
    case (FILTERS.WATCHLIST):
      titleText = watchlistFilter.text;
      titleClass = '';
      break;
    case (FILTERS.HISTORY):
      titleText = historyFilter.text;
      titleClass = '';
      break;
    case (FILTERS.FAVORITES):
      titleText = favoritesFilter.text;
      titleClass = '';
      break;
    default:
      titleText = 'All movies. Upcoming';
      titleClass = 'visually-hidden';
  }

  return `<section class="films-list">
    <h2 class="films-list__title ${titleClass}">${titleText}</h2>
  </section>`;
};

export default class NoFilms {
  constructor(filter) {
    this._filter = filter;
    this._element = null;
  }

  getTemplate() {
    return createNoFilmsTemplate(this._filter);
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