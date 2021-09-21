import UserRankView from '../view/rank.js';
import FilmsView from '../view/films.js';
import SortView from '../view/sort.js';
import PopupView from '../view/popup.js';
import FilmsListView from '../view/films-list.js';
import LoadingView from '../view/loading.js';
import FilmsListContainerView from '../view/films-list-container.js';
import NoFilmsView from '../view/no-films.js';
import ExtraView from '../view/films-extra.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardPresenter from './card-presenter.js';
import {checkEscEvent} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import {sortDate, sortRating, sortComments} from '../utils/card.js';
import {SortType, UpdateType, UserAction, FilterType, State} from '../const.js';
import {filter} from '../utils/filter.js';

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

const FilmsExtraList = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class Movie {
  constructor(movieContainer, siteHeaderContainer, cardsModel, filterModel, api) {
    this._cardsModel = cardsModel;
    this._filterModel = filterModel;
    this._movieContainer = movieContainer;
    this._headerContainer = siteHeaderContainer;
    this._api = api;
    this._renderedCardsCount = MOVIE_COUNT_PER_STEP;
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
    this._isLoading = true;

    this._loadingComponent = new LoadingView();
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

    this._renderMovieBoard();
  }

  destroy() {
    this._clearMovieBoard({ resetRenderedTaskCount: true, resetSortType: true });

    remove(this._filmsComponent);
    remove(this._filmsListComponent);
    remove(this._filmsListContainerComponent);
    remove(this._extraTopRatedComponent);
    remove(this._extraMostCommentedComponent);

    this._cardsModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  _getCards() {
    this._filterType = this._filterModel.getFilter();
    const cards = this._cardsModel.getCards();
    if (!this._filterType) {
      this._filterType = FilterType.ALL;
    }
    if (this._filterType === FilterType.STATISTICS) {
      this._filterType = FilterType.ALL;
    }
    const filtredCards = filter[this._filterType](cards);

    switch (this._currentSortType) {
      case SortType.DATE:
        return filtredCards.sort(sortDate);
      case SortType.RATING:
        return filtredCards.sort(sortRating);
    }
    return filtredCards;
  }

  _setViewState(state, update) {
    if (!this._openedCardId) {
      return;
    }

    switch (state) {
      case State.ADDING:
        this._openedPopup.updateData({
          isAdding: true,
        });
        break;
      case State.DELETING:
        this._openedPopup.updateData({
          isDeleting: true,
          deletingId: update,
        });
        break;
      case State.ABORTING_DELETING:
        this._openedPopup.shakeDelete(update);
        break;
      case State.ABORTING_ADDING:
        this._openedPopup.shakeAdd({ resetState: true });
        break;
    }
  }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this._api.updateCard(update).then((response) => {
          this._cardsModel.updateCard(updateType, response);
        });
        break;
      case UserAction.ADD_COMMENT:
        this._api
          .addComment(update)
          .then((response) => {
            this._cardsModel.updateCard(updateType, response);
          })
          .catch(() => {
            this._setViewState(State.ABORTING_ADDING);
          });
        break;
      case UserAction.DELETE_COMMENT:
        this._setViewState(State.DELETING, update);
        this._api
          .deleteComment(update)
          .then(() => {
            this._cardsModel.deleteComment(updateType, update);
          })
          .catch(() => {
            this._setViewState(State.ABORTING_DELETING, update);
          });
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
        this._renderMovieBoard();
        break;
      case UpdateType.MAJOR:
        this._clearMovieBoard({ resetRenderedCardCount: true, resetSortType: true });
        this._renderMovieBoard();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingComponent);
        this._renderMovieBoard();
    }
    if (this._openedPopup) {
      this._openPopup(updatedCard)();
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
    this._renderMovieBoard();
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
      this._api.getComments(card).then((comments) => {
        this._cardsModel.setComments(comments);

        if (this._openedPopup) {
          this._closePopup();
        }
        const popup = new PopupView(card, this._handleViewAction, this._cardsModel.getComments());
        document.body.appendChild(popup.getElement());
        document.body.classList.add('hide-overflow');
        popup.setClosePopupHandler(this._closePopup);

        this._openedCardId = card.id;
        this._openedPopup = popup;
        document.addEventListener('keydown', this._escKeyDownHandler);
      });
    };
  }

  _renderCard(presenter, container, card) {
    const cardPresenter = new CardPresenter(container, this._handleViewAction, this._openPopup);
    cardPresenter.init(card);
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
    const newRenderedCardCount = Math.min(cardCount, this._renderedCardsCount + MOVIE_COUNT_PER_STEP);
    const cards = this._getCards().slice(this._renderedCardsCount, newRenderedCardCount);

    this._renderCards(cards);
    this._renderedCardsCount = newRenderedCardCount;

    if (this._renderedCardsCount >= cardCount) {
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
    this._renderedCardsCount = MOVIE_COUNT_PER_STEP;
    remove(this._showMoreButtonComponent);
  }

  _clearMovieBoard({ resetRenderedCardCount = false, resetSortType = false } = {}) {
    const cardsCount = this._getCards().length;

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
    remove(this._profileRankComponent);
    remove(this._extraMostCommentedComponent);

    if (cardsCount < this._renderedCardsCount) {
      resetRenderedCardCount = true;
    }

    if (resetRenderedCardCount) {
      this._renderedCardsCount = MOVIE_COUNT_PER_STEP;
    } else {
      this._renderedCardsCount = Math.min(cardsCount, this._renderedCardsCount);
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

  _renderExtraCardsList(presenter, extraCardsListElement, sortType) {
    render(this._filmsComponent, extraCardsListElement, RenderPosition.BEFOREEND);
    const extraCardsListComponent = new FilmsListContainerView();
    render(extraCardsListElement, extraCardsListComponent, RenderPosition.BEFOREEND);
    this._cardsModel.getCards().
      slice().
      sort(sortType).
      splice(0, EXTRA_MOVIE_COUNT).
      forEach((card) => this._renderCard(presenter, extraCardsListComponent, card));
  }

  _getAllCards() {
    return this._cardsModel.getCards();
  }

  _renderProfileRank(cards) {
    if (!this._profileRankComponent === null) {
      this._profileRankComponent = null;
    }
    this._profileRankComponent = new UserRankView(cards);
    render(
      this._headerContainer,
      this._profileRankComponent,
      RenderPosition.BEFOREEND,
    );
  }

  _renderLoading() {
    render(
      this._filmsListComponent,
      this._loadingComponent,
      RenderPosition.AFTERBEGIN,
    );
  }

  _renderMovieBoard() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const allCards = this._getAllCards();
    const cards = this._getCards();
    const cardsCount = cards.length;

    if (cardsCount === 0) {
      this._noCards = true;
      this._renderNoFilms();
      return;
    }
    this._renderNoFilms();
    render(this._filmsListComponent, this._filmsListContainerComponent, RenderPosition.BEFOREEND);

    this._renderSort();
    this._renderProfileRank(allCards);
    this._renderCards(cards.slice(0, Math.min(cardsCount, this._renderedCardsCount)));

    if (cardsCount > this._renderedCardsCount) {
      this._renderShowMoreButton();
    }

    this._renderExtraCardsList(this._extraTopRatedPresenter, this._extraTopRatedComponent, sortRating);
    this._renderExtraCardsList(this._extraMostCommentedPresenter, this._extraMostCommentedComponent, sortComments);
  }
}
