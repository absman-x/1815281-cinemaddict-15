import FilmsView from '../view/films.js';
import MenuView from '../view/menu.js';
import SortView from '../view/sort.js';
import PopupView from '../view/popup.js';
import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import ExtraView from '../view/films-extra.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardPresenter from './film-card.js';
import {checkEscEvent, updateItem} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import { sortDate, sortRating, sortComments} from '../utils/card.js';
import { SortType } from '../const.js';
import { generateComment } from '../mock/comment-mock.js';

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
    this._openedPopup = null;
    this._openedCard = null;

    this._filmsComponent = new FilmsView();
    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._handleCardChange = this._handleCardChange.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._openPopup = this._openPopup.bind(this);
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

  _handleCardChange(updatedCard) {
    this._cardList = updateItem(this._cardList, updatedCard);
    this._sourcedCardList = updateItem(this._sourcedCardList, updatedCard);
    if (this._cardPresenter.has(updatedCard.id)) {
      this._cardPresenter.get(updatedCard.id).init(updatedCard);
    }
    if (this._extraTopRatedPresenter.has(updatedCard.id)) {
      this._extraTopRatedPresenter.get(updatedCard.id).init(updatedCard);
    }
    if (this._extraMostCommentedPresenter.has(updatedCard.id)) {
      this._extraMostCommentedPresenter.get(updatedCard.id).init(updatedCard);
    }
  }

  _sortCards(sortType) {
    // 2. Этот исходный массив задач необходим,
    // потому что для сортировки мы будем мутировать
    // массив в свойстве _cardList
    switch (sortType) {
      case SortType.DATE:
        this._cardList.sort(sortDate);
        break;
      case SortType.RATING:
        this._cardList.sort(sortRating);
        break;
      default:
        this._cardList = this._sourcedCardList.slice();
    }

    this._currentSortType = sortType;
    this._sortComponent.getElement().querySelectorAll('.sort__button').forEach((sortButton) => {
      if (sortButton.dataset.sortType === this._currentSortType) {
        sortButton.classList.add('sort__button--active');
      } else {
        sortButton.classList.remove('sort__button--active');
      }
    });
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    if (this._openedPopup) {
      this._closePopup();
    }

    this._sortCards(sortType);
    this._clearCardList();
    this._renderCardList();
  }

  _renderSort() {
    render(this._movieContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
  }

  _escKeyDownHandler(evt) {
    if (checkEscEvent(evt)) {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _closePopup() {
    remove(this._openedPopup);
    document.body.classList.remove('hide-overflow');
    document.removeEventListener('keydown', this._escKeyDownHandler);
    this._openedPopup = null;
  }

  _openPopup(card) {
    return () => {
      if (card === this._openedCard) {
        return;
      }
      if (this._openedPopup) {
        this._closePopup();
      }
      const cardComments = (card.comments).map((id) => generateComment(id));
      const popupCard = Object.assign({}, card, {cardComments});
      const popup = new PopupView(popupCard, this._handleCardChange);
      document.body.appendChild(popup.getElement());
      document.body.classList.add('hide-overflow');
      popup.setClosePopupHandler(this._closePopup);

      this._openedCard = card;
      this._openedPopup = popup;
      document.addEventListener('keydown', this._escKeyDownHandler);
    };
  }

  _renderCard(presenter, container, card) {
    const cardPresenter = new CardPresenter(container, this._handleCardChange, this._openPopup);
    const comments = (card.comments).map((id) => generateComment(id));
    cardPresenter.init(card, comments);
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
      this._renderNoFilms('All movies');
      return;
    }

    this._renderSort();
    this._renderMenu(this._cardList);
    this._renderCardList();

    this._renderExtraCardsList(this._extraTopRatedPresenter, FilmsExtraList.TOP_RATED, sortRating);
    this._renderExtraCardsList(this._extraMostCommentedPresenter, FilmsExtraList.MOST_COMMENTED, sortComments);
  }
}
