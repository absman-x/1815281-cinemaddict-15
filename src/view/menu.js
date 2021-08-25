import AbstractView from './abstract.js';

const createMenuTemplate = (cardList) => {
  const watchlistCount = cardList.filter((card) => card.userDetails.watchlist).length;
  const watchedCount = cardList.filter((card) => card.userDetails.already_watched).length;
  const favoriteCount = cardList.filter((card) => card.userDetails.favorite).length;
  return `<nav class="main-navigation">
    <div class="main-navigation__items">
      <a href="#all" class="main-navigation__item main-navigation__item--active">All movies</a>
      <a href="#watchlist" class="main-navigation__item">Watchlist <span class="main-navigation__item-count">${watchlistCount}</span></a>
      <a href="#history" class="main-navigation__item">History <span class="main-navigation__item-count">${watchedCount}</span></a>
      <a href="#favorites" class="main-navigation__item">Favorites <span class="main-navigation__item-count">${favoriteCount}</span></a>
    </div>
    <a href="#stats" class="main-navigation__additional">Stats</a>
  </nav>
  <ul class="sort">
    <li><a href="#" class="sort__button sort__button--active">Sort by default</a></li>
    <li><a href="#" class="sort__button">Sort by date</a></li>
    <li><a href="#" class="sort__button">Sort by rating</a></li>
  </ul>`;
};

export default class Menu extends AbstractView {
  constructor(cardList) {
    super();
    this._cardList = cardList;
  }

  getTemplate() {
    return createMenuTemplate(this._cardList);
  }
}
