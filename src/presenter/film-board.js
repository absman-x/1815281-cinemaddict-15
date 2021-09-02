import FilmsView from '../view/films.js';
import MenuView from '../view/menu.js';
import SortView from '../view/sort.js';
import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import ExtraView from '../view/films-extra.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardPresenter from './film-card.js';
import {updateItem} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import { sortDate, sortRating, sortComments} from '../utils/card.js';
import {SortType} from '../const.js';

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

const FilmsExtraList = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class Movie {
  constructor(movieContainer) {
    this._movieContainer = movieContainer;
    this._renderedCardCount = MOVIE_COUNT_PER_STEP;
    this._cardPresenter = new Map();
    this._extraTopRatedPresenter = new Map();
    this._extraMostCommentedPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;

    this._filmsComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(cardList) {
    this._cardList = cardList.slice();
    // 1. В отличии от сортировки по любому параметру,
    // исходный порядок можно сохранить только одним способом -
    // сохранив исходный массив:
    this._sourcedCardList = cardList.slice();

    render(this._movieContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
    render(this._noFilmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderMovie();
  }

  _handleModeChange() {
    this._cardPresenter.forEach((presenter) => presenter.resetView());
    this._extraTopRatedPresenter.forEach((presenter) => presenter.resetView());
    this._extraMostCommentedPresenter.forEach((presenter) => presenter.resetView());
  }

  _handleCardChange(updatedCard) {
    this._cardList = updateItem(this._cardList, updatedCard);
    this._sourcedCardList = updateItem(this._sourcedCardList, updatedCard);
    this._cardPresenter.has(updatedCard.id) ? this._cardPresenter.get(updatedCard.id).init(updatedCard) : '';
    this._extraTopRatedPresenter.has(updatedCard.id) ? this._extraTopRatedPresenter.get(updatedCard.id).init(updatedCard) : '';
    this._extraMostCommentedPresenter.has(updatedCard.id) ? this._extraMostCommentedPresenter.get(updatedCard.id).init(updatedCard) : '';
  }

  _sortCards(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _cardList
    switch (sortType) {
      case SortType.DATE:
        this._cardList.sort(sortDate);
        this._setActiveButton(sortType);
        break;
      case SortType.RATING:
        this._cardList.sort(sortRating);
        this._setActiveButton(sortType);
        break;
      default:
        // 3. А когда пользователь захочет "вернуть всё, как было",
        // мы просто запишем в _cardList исходный массив
        this._cardList = this._sourcedCardList.slice();
        this._setActiveButton(sortType);
    }

    this._currentSortType = sortType;
  }

  _setActiveButton(sortType) {
    document.querySelectorAll('[data-sort-type]').forEach((element) => element.classList.remove('sort__button--active'));
    document.querySelector(`[data-sort-type=${sortType}`).classList.add('sort__button--active');
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortCards(sortType);
    this._clearCardList();
    this._renderCardList();
  }

  _renderSort() {
    render(this._movieContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  /*_renderCard(container, card) {
    const cardPresenter = new CardPresenter(container, this._handleCardChange, this._handleModeChange);
    cardPresenter.init(card);
    this._cardPresenter.set(card.id, cardPresenter);
  }*/

  _renderCard(presenter, container, card) {
    const cardPresenter = new CardPresenter(container, this._handleCardChange, this._handleModeChange);
    cardPresenter.init(card);
    //this.presenter.set(card.id, cardPresenter);
    presenter.set(card.id, cardPresenter);
  }

  _renderCards(from, to) {
    this._cardList
      .slice(from, to)
      .forEach((movieCard) => this._renderCard(this._cardPresenter, this._filmsListComponent, movieCard));
  }

  _renderNoCards() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    this._renderCards(this._renderedCardCount, this._renderedCardCount + MOVIE_COUNT_PER_STEP);
    this._renderedCardCount += MOVIE_COUNT_PER_STEP;

    if (this._renderedCardCount >= this._cardList.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    render(this._noFilmsComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _clearCardList() {
    //this._cardPresenter.forEach((presenter) => presenter.destroy());
    this._cardPresenter.forEach((presenter) => presenter.destroy());
    this._cardPresenter.clear();
    this._renderedCardCount = MOVIE_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _renderCardList() {
    this._renderCards(0, Math.min(this._cardList.length, MOVIE_COUNT_PER_STEP));

    if (this._cardList.length > MOVIE_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderMenu(cardList) {
    // Метод для рендеринга сортировки
    this._cardList = cardList.slice();
    this._menuComponent = new MenuView(this._cardList);
    render(this._movieContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderExtraCardsList(presenter, extraListType, sortType) {
    const extraCardsListElement = new ExtraView(extraListType);
    render(this._filmsComponent, extraCardsListElement, RenderPosition.BEFOREEND);
    const extraCardsListComponent = new FilmsListView();
    render(extraCardsListElement, extraCardsListComponent, RenderPosition.BEFOREEND);
    this._sourcedCardList.
      slice().
      sort(sortType).
      splice(0, EXTRA_MOVIE_COUNT).
      forEach((card) => this._renderCard(presenter, extraCardsListComponent, card));
  }

  _renderMovie() {
    if (this._cardList.length === 0) {
      //render(this._filmsComponent, this._noFilmsComponent('All movies'), RenderPosition.AFTERBEGIN);
      this._renderNoFilms('All movies');
      return;
    }

    this._renderSort();
    this._renderMenu(this._cardList);
    this._renderCardList();
    //this._renderExtraCardsList(this._extraTopRatedPresenter, FilmsExtraList.TOP_RATED, this._sourcedCardList.slice().sort(sortRating).splice(0, EXTRA_MOVIE_COUNT));
    //this._renderExtraCardsList(this._extraMostCommentedPresenter, FilmsExtraList.MOST_COMMENTED, this._sourcedCardList.slice().sort(sortComments).splice(0, EXTRA_MOVIE_COUNT));
    this._renderExtraCardsList(this._extraTopRatedPresenter, FilmsExtraList.TOP_RATED, sortRating);
    this._renderExtraCardsList(this._extraMostCommentedPresenter, FilmsExtraList.MOST_COMMENTED, sortComments);
  }
}
