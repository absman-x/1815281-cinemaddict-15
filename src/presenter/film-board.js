import FilmsView from '../view/films.js';
import MenuView from '../view/menu.js';
import SortView from '../view/sort.js';
import PopupView from '../view/popup.js';
import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import ExtraView from '../view/films-extra.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import CardPresenter from './film-card.js';
import {checkEscEvent} from '../utils/common.js';
import {render, RenderPosition, remove} from '../utils/render.js';
import { sortDate, sortRating, sortComments} from '../utils/card.js';
import { SortType, UpdateType, UserAction } from '../const.js';
import { generateComment } from '../mock/comment-mock.js';

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

const FilmsExtraList = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};

export default class Movie {
  constructor(movieContainer, cardsModel) {
    this._cardsModel = cardsModel;
    this._movieContainer = movieContainer;
    this._renderedCardCount = MOVIE_COUNT_PER_STEP;
    this._cardPresenter = new Map();
    this._extraTopRatedPresenter = new Map();
    this._extraMostCommentedPresenter = new Map();
    this._currentSortType = SortType.DEFAULT;
    this._openedPopup = null;
    this._openedCard = null;
    this._sortComponent = null;
    this._showMoreButtonComponent = null;

    this._filmsComponent = new FilmsView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();
    this._extraTopRatedComponent = new ExtraView(FilmsExtraList.TOP_RATED);
    this._extraMostCommentedComponent = new ExtraView(FilmsExtraList.MOST_COMMENTED);
    //this._showMoreButtonComponent = new ShowMoreButtonView();

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
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
    //render(this._noFilmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);

    this._renderMovie();
  }

  _getCards() {
    switch (this._currentSortType) {
      case SortType.DATE:
        return this._cardsModel.getCards().slice().sort(sortDate);
      case SortType.RATING:
        return this._cardsModel.getCards().slice().sort(sortRating);
    }
    return this._cardsModel.getCards();
  }

  // _handleCardChange(updatedCard) {
  //   if (this._cardPresenter.has(updatedCard.id)) {
  //     this._cardPresenter.get(updatedCard.id).init(updatedCard);
  //   }
  //   if (this._extraTopRatedPresenter.has(updatedCard.id)) {
  //     this._extraTopRatedPresenter.get(updatedCard.id).init(updatedCard);
  //   }
  //   if (this._extraMostCommentedPresenter.has(updatedCard.id)) {
  //     this._extraMostCommentedPresenter.get(updatedCard.id).init(updatedCard);
  //   }
  // }

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_CARD:
        this._cardsModel.updateCard(updateType, update);
        break;
      case UserAction.ADD_COMMENT:
        this._cardsModel.addComment(updateType, update);
        break;
      case UserAction.DELETE_COMMENT:
        this._cardsModel.deleteComment(updateType, update);
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
    // this._clearCardList();
    // this._renderCardList();
    this._clearMovieBoard({ resetRenderedCardCount: true });
    this._renderMovie();
  }

  _renderSort() {
    if (this._sortComponent !== null) {
      this._sortComponent = null;
    }

    this._sortComponent = new SortView(this._currentSortType);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._movieContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
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
    this._openedCard = null;
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
      const popup = new PopupView(popupCard, this._handleViewAction);
      document.body.appendChild(popup.getElement());
      document.body.classList.add('hide-overflow');
      popup.setClosePopupHandler(this._closePopup);

      this._openedCard = card;
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
    cards.forEach((movieCard) => this._renderCard(this._cardPresenter, this._filmsListComponent, movieCard));
  }

  _renderNoCards() {
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
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
    //render(this._noFilmsComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    if (this._showMoreButtonComponent !== null) {
      this._showMoreButtonComponent = null;
    }

    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);

    render(this._noFilmsComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);
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

    remove(this._sortComponent);
    remove(this._menuComponent);
    //remove(this._noFilmsComponent);
    remove(this._showMoreButtonComponent);
    remove(this._extraTopRatedComponent);
    remove(this._extraMostCommentedComponent);
    //debugger;
    if (resetRenderedCardCount) {
      this._renderedCardCount = MOVIE_COUNT_PER_STEP;
    } else {
      // На случай, если перерисовка доски вызвана
      // уменьшением количества задач (например, удаление или перенос в архив)
      // нужно скорректировать число показанных задач
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

  //_renderMenu(cardList) {
  //this._cardList = cardList.slice();
  _renderMenu() {
    this._menuComponent = new MenuView(this._getCards().slice());
    render(this._movieContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderExtraCardsList(presenter, extraCardsListElement, extraListType, sortType) {
    //const extraCardsListElement = new ExtraView(extraListType);
    render(this._filmsComponent, extraCardsListElement, RenderPosition.BEFOREEND);
    const extraCardsListComponent = new FilmsListView();
    render(extraCardsListElement, extraCardsListComponent, RenderPosition.BEFOREEND);
    this._getCards().
      slice().
      sort(sortType).
      splice(0, EXTRA_MOVIE_COUNT).
      forEach((card) => this._renderCard(presenter, extraCardsListComponent, card));
  }

  _renderMovie() {
    render(this._noFilmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    const cards = this._getCards();
    const cardCount = cards.length;

    if (cardCount === 0) {
      this._renderNoFilms('All movies');
      return;
    }

    this._renderSort();
    //this._renderMenu(this._cardList);
    this._renderMenu();
    //this._renderCardList();

    this._renderCards(cards.slice(0, Math.min(cardCount, this._renderedCardCount)));

    if (cardCount > this._renderedCardCount) {
      this._renderShowMoreButton();
    }

    this._renderExtraCardsList(this._extraTopRatedPresenter, this._extraTopRatedComponent, FilmsExtraList.TOP_RATED, sortRating);
    this._renderExtraCardsList(this._extraMostCommentedPresenter, this._extraMostCommentedComponent, FilmsExtraList.MOST_COMMENTED, sortComments);
  }
}
