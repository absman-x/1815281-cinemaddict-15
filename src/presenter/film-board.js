import FilmsView from '../view/films.js';
import MenuView from '../view/menu.js';
import SortView from '../view/sort.js';
import PopupView from '../view/popup.js';
import FilmsListView from '../view/films-list.js';
import FilmsListContainerView from '../view/films-list-container.js';
import NoFilmsView from '../view/no-films.js';
import ExtraView from '../view/films-extra.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardPresenter from './film-card.js';
import {checkEscEvent} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import { sortDate, sortRating, sortComments} from '../utils/card.js';
import { SortType, UpdateType, UserAction, FilterType } from '../const.js';
import { generateComment } from '../mock/comment-mock.js';
import { filter } from '../utils/filter.js';

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

const FilmsExtraList = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class Movie {
  constructor(movieContainer, cardsModel, filterModel) {
    this._cardsModel = cardsModel;
    this._filterModel = filterModel;
    this._movieContainer = movieContainer;
    this._renderedCardCount = MOVIE_COUNT_PER_STEP;
    this._cardPresenter = new Map();
    this._extraTopRatedPresenter = new Map();
    this._extraMostCommentedPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._filterType = FilterType.ALL;
    this._noCards = false;
    this._openedPopup = null;
    this._openedCardId = null;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._filmsListContainerComponent = new FilmsListContainerView();
    this._extraTopRatedComponent = new ExtraView(FilmsExtraList.TOP_RATED);
    this._extraMostCommentedComponent = new ExtraView(FilmsExtraList.MOST_COMMENTED);

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    this._closePopup = this._closePopup.bind(this);
    this._openPopup = this._openPopup.bind(this);

    this._cardsModel.addObserver(this._handleModelEvent);
  }

  init() {
    render(this._movieContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._cardsModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderMovie();
  }

  _getCards() {
    this._filterType = this._filterModel.getFilter();
    const cards = this._cardsModel.getCards();
    const filtredCards = filter[this._filterType](cards);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredCards.sort(sortDate);
      case SortType.RATING:
        return filtredCards.sort(sortRating);
    }
    return filtredCards;
  }

  _handleViewAction(actionType, updateType, update, comment) {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this._cardsModel.updateCard(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._cardsModel.addComment(updateType, update, comment);
        break;
      case UserAction.DELETE_COMMENT:
        this._cardsModel.deleteComment(updateType, update, comment);
        break;
    }
  }

  _handleModelEvent(updateType, updatedCard) {
    switch (updateType) {
      case UpdateType.PATCH:
        if (this._cardPresenter.has(updatedCard.id)) {
          this._cardPresenter.get(updatedCard.id).init(updatedCard);
        }
        if (this._extraTopRatedPresenter.has(updatedCard.id)) {
          this._extraTopRatedPresenter.get(updatedCard.id).init(updatedCard);
        }
        if (this._extraMostCommentedPresenter.has(updatedCard.id)) {
          this._extraMostCommentedPresenter.get(updatedCard.id).init(updatedCard);
        }
        break;
      case UpdateType.MINOR:
        this._clearMovieBoard();
        this._renderMovie();
        break;
      case UpdateType.MAJOR:
        this._clearMovieBoard({ resetRenderedCardCount: true, resetSortType: true });
        this._renderMovie();
        break;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    if (this._openedPopup) {
      this._closePopup();
    }

    this._currentSortType = sortType;
    this._clearMovieBoard({ resetRenderedCardCount: true });
    this._renderMovie();
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
    this._openedCardId = null;
  }

  _openPopup(card) {
    return () => {
      if (card.id === this._openedCardId) {
        return;
      }
      if (this._openedPopup) {
        this._closePopup();
      }
      const cardComments = (card.comments).map((id) => generateComment(id));
      //const popupCard = Object.assign({}, card, {cardComments});
      const popup = new PopupView(card, this._handleViewAction, cardComments);
      document.body.appendChild(popup.getElement());
      document.body.classList.add('hide-overflow');
      popup.setClosePopupHandler(this._closePopup);

      this._openedCardId = card.id;
      this._openedPopup = popup;
      document.addEventListener('keydown', this._escKeyDownHandler);
    };
  }

  _renderCard(presenter, container, card) {
    const cardPresenter = new CardPresenter(container, this._handleViewAction, this._openPopup);
    const comments = (card.comments).map((id) => generateComment(id));
    cardPresenter.init(card, comments);
    presenter.set(card.id, cardPresenter);
  }

  _renderCards(cards) {
    cards.forEach((movieCard) => this._renderCard(this._cardPresenter, this._filmsListContainerComponent, movieCard));
  }

  _renderNoFilms() {
    this._noFilmsComponent = new NoFilmsView(this._filterType, this._noCards);
    render(this._filmsListComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    const cardCount = this._getCards().length;
    const newRenderedCardCount = Math.min(cardCount, this._renderedCardCount + MOVIE_COUNT_PER_STEP);
    const cards = this._getCards().slice(this._renderedCardCount, newRenderedCardCount);

    this._renderCards(cards);
    this._renderedCardCount = newRenderedCardCount;

    if (this._renderedCardCount >= cardCount) {
      remove(this._showMoreButtonComponent);
    }
  }

  _renderShowMoreButton() {
    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._filmsListComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
    render(this._filmsComponent, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _clearCardList() {
    this._cardPresenter.forEach((presenter) => presenter.destroy());
    this._cardPresenter.clear();
    this._renderedCardCount = MOVIE_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _clearMovieBoard({ resetRenderedCardCount = false, resetSortType = false } = {}) {
    const cardCount = this._getCards().length;

    this._cardPresenter.forEach((presenter) => presenter.destroy());
    this._cardPresenter.clear();
    this._extraTopRatedPresenter.forEach((presenter) => presenter.destroy());
    this._extraTopRatedPresenter.clear();
    this._extraMostCommentedPresenter.forEach((presenter) => presenter.destroy());
    this._extraMostCommentedPresenter.clear();

    this._noCards = false;
    remove(this._sortComponent);
    remove(this._noFilmsComponent);
    remove(this._showMoreButtonComponent);
    remove(this._extraTopRatedComponent);
    remove(this._extraMostCommentedComponent);
    if (resetRenderedCardCount) {
      this._renderedCardCount = MOVIE_COUNT_PER_STEP;
    } else {
      this._renderedCardCount = Math.min(cardCount, this._renderedCardCount);
    }

    if (resetSortType) {
      this._currentSortType = SortType.DEFAULT;
    }
  }

  _renderCardList() {
    const cardCount = this._getCards().length;
    const cards = this._getCards().slice(0, Math.min(cardCount, MOVIE_COUNT_PER_STEP));

    this._renderCards(cards);

    if (cardCount > MOVIE_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderMenu() {
    this._menuComponent = new MenuView(this._getCards().slice());
    render(this._movieContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderExtraCardsList(presenter, extraCardsListElement, extraListType, sortType) {
    render(this._filmsComponent, extraCardsListElement, RenderPosition.BEFOREEND);
    const extraCardsListComponent = new FilmsListContainerView();
    render(extraCardsListElement, extraCardsListComponent, RenderPosition.BEFOREEND);
    this._getCards().
      slice().
      sort(sortType).
      splice(0, EXTRA_MOVIE_COUNT).
      forEach((card) => this._renderCard(presenter, extraCardsListComponent, card));
  }

  _renderMovie() {
    const cards = this._getCards();
    const cardCount = cards.length;

    if (cardCount === 0) {
      this._noCards = true;
      this._renderNoFilms();
      return;
    }
    this._renderNoFilms();
    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderSort();

    this._renderCards(cards.slice(0, Math.min(cardCount, this._renderedCardCount)));

    if (cardCount > this._renderedCardCount) {
      this._renderShowMoreButton();
    }

    this._renderExtraCardsList(this._extraTopRatedPresenter, this._extraTopRatedComponent, FilmsExtraList.TOP_RATED, sortRating);
    this._renderExtraCardsList(this._extraMostCommentedPresenter, this._extraMostCommentedComponent, FilmsExtraList.MOST_COMMENTED, sortComments);
  }
}
