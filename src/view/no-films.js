import AbstractView from './abstract.js';
import { FilterType } from '../const.js';

const NoCardsTextType = {
  [FilterType.ALL]: 'There are no movies in our database',
  [FilterType.WATCHLIST]: 'There are no movies to watch now',
  [FilterType.HISTORY]: 'There are no watched movies now',
  [FilterType.FAVORITES]: 'There are no favorite movies now',
};

const createNoFilmsTemplate = (filterType, noCards) => {
  const noCardTextValue = NoCardsTextType[filterType];

  let titleText = 'All movies. Upcoming';
  let titleClass = 'visually-hidden';

  if (noCards) {
    switch (filterType) {
      case (FilterType.ALL):
        titleText = noCardTextValue;
        titleClass ='';
        break;
      case (FilterType.WATCHLIST):
        titleText = noCardTextValue;
        titleClass = '';
        break;
      case (FilterType.HISTORY):
        titleText = noCardTextValue;
        titleClass = '';
        break;
      case (FilterType.FAVORITES):
        titleText = noCardTextValue;
        titleClass = '';
        break;
      default:
        titleText = 'All movies. Upcoming';
        titleClass = 'visually-hidden';
    }
  }

  return `<h2 class="films-list__title ${titleClass}">${titleText}</h2>`;
};

export default class NoFilms extends AbstractView {
  constructor(filter, noCards) {
    super();
    this._noCards = noCards;
    this._filter = filter;
  }

  getTemplate() {
    return createNoFilmsTemplate(this._filter, this._noCards);
  }
}
