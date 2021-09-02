import MenuView from '../view/menu.js';
import SortView from '../view/sort.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import ExtraView from '../view/films-extra.js';
import CardView from '../view/card.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import PopupView from '../view/popup.js';
import { updateItem } from '../utils/common.js';
import { render, RenderPosition, remove, replace } from '../utils/render.js';
//не должно быть в presenter?
import { generateComment } from '../mock/comment-mock.js';

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;

const FilmsExtraList = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};
const siteBodyElement = document.body;

export default class Movie {
  constructor(movieContainer) {
    this._movieContainer = movieContainer;
    this._renderedCardCount = MOVIE_COUNT_PER_STEP;
    this._filmsComponent = new FilmsView();
    //this._menuComponent = new MenuView(cardList);
    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();
    this._currentPopup = undefined;
    this._updatedCard = undefined;

    /*this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);*/
    this._handleEscKeyDown = this._handleEscKeyDown.bind(this);
    this._handleShowMoreButtonClick = this._handleShowMoreButtonClick.bind(this);
  }

  init(cardList) {
    this._cardList = cardList.slice();
    // Метод для инициализации (начала работы) модуля,
    // малая часть текущей функции renderBoard в main.js
    this._sourcedCardList = cardList.slice();

    render(this._movieContainer, this._filmsComponent, RenderPosition.BEFOREEND);
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.BEFOREEND);
    //render(this._noFilmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    render(this._noFilmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);


    this._renderMovie();
  }

  _renderMenu(cardList) {
    // Метод для рендеринга сортировки
    this._cardList = cardList.slice();
    this._menuComponent = new MenuView(this._cardList);
    render(this._movieContainer, this._menuComponent, RenderPosition.AFTERBEGIN);
  }

  _renderSort() {
    // Метод для рендеринга сортировки
    render(this._movieContainer, this._sortComponent, RenderPosition.AFTERBEGIN);
  }

  _renderCard(container, card) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
    //this._card = card;
    const card2 = card;
    console.log(card);
    this._cardComponent = new CardView(card);
    //popupComments = (card.comments).map((id) => generateComment(id));
    this._container = container;

    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick(card2));
    this._cardComponent.setOpenPopupHandler(() => {
      //this._showPopup(card, popupComments);
      this._showPopup(card);
      document.addEventListener('keydown', this._handleEscKeyDown);
    });

    render(this._container, this._cardComponent, RenderPosition.BEFOREEND);
  }

  _handleEscKeyDown(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _showPopup(card) {
    this._card = card;
    //this._popupComments = popupComments;
    this._popupComments = (card.comments).map((id) => generateComment(id));
    this._popupComponent = new PopupView(this._card, this._popupComments);

    if (this._currentPopup) {this._closePopup();}

    this._currentPopup = this._popupComponent.getElement();
    siteBodyElement.appendChild(this._currentPopup);
    siteBodyElement.classList.add('hide-overflow');

    this._popupComponent.setClosePopupHandler(() => {
      this._closePopup();
    });
  }

  _closePopup() {
    document.removeEventListener('keydown', this._handleEscKeyDown);
    siteBodyElement.removeChild(this._currentPopup);
    siteBodyElement.classList.remove('hide-overflow');
    this._currentPopup = undefined;
  }

  _renderCards(from, to) {
    this._cardList
      .slice(from, to)
      .forEach((card) => this._renderCard(this._filmsListComponent, card));
  }

  _renderNoFilms(typeNoFilms) {
    // Метод для рендеринга заглушки
    this._noFilmsComponent = new NoFilmsView(typeNoFilms);
    render(this._filmsComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
  }

  _handleShowMoreButtonClick() {
    this._renderCards(this._renderedCardCount, this._renderedCardCount + MOVIE_COUNT_PER_STEP);
    this._renderedCardCount += MOVIE_COUNT_PER_STEP;

    if (this._renderedCardCount >= this._cardList.length) {
      remove(this._showMoreButtonComponent);
    }
  }

  _handleCardChange(updatedCard) {
    this._cardList = updateItem(this._cardList, updatedCard);
    this._sourcedCardList = updateItem(this._sourcedCardList, updatedCard);
    //this._taskPresenter.get(updatedCard.id).init(updatedCard);
  }

  _handleFavoriteClick(card) {
    console.log(card);
    //this._card = card;
    this._updatedCard = card;
    console.log(this._updatedCard);
    this._updatedCard.userDetails = Object.assign({}, card.userDetails, { favorite: !card.userDetails.favorite});
    console.log(this._updatedCard);
  }

  _renderShowMoreButton() {
    render(this._noFilmsComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderCardsList() {
    this._renderCards(0, Math.min(this._cardList.length, MOVIE_COUNT_PER_STEP));

    if (this._cardList.length > MOVIE_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderExtraCardsList(extraListType, extraFilmCards) {
    const extraCardsListElement = new ExtraView(extraListType);
    render(this._filmsComponent, extraCardsListElement, RenderPosition.BEFOREEND);
    const extraCardsListComponent = new FilmsListView();
    render(extraCardsListElement, extraCardsListComponent, RenderPosition.BEFOREEND);
    extraFilmCards.forEach((card) => this._renderCard(extraCardsListComponent, card));
  }

  _renderMovie() {
    // Метод для инициализации (начала работы) модуля,
    // бОльшая часть текущей функции renderBoard в main.js
    if (this._cardList.length === 0) {
      //render(this._filmsComponent, this._noFilmsComponent('All movies'), RenderPosition.AFTERBEGIN);
      this._renderNoFilms('All movies');
      return;
    }

    this._renderSort();
    this._renderMenu(this._cardList);
    this._renderCardsList();
    this._renderExtraCardsList(FilmsExtraList.TOP_RATED, this._cardList.slice().sort((element1, element2) => element2.filmInfo.totalRating - element1.filmInfo.totalRating).splice(0, EXTRA_MOVIE_COUNT));
    this._renderExtraCardsList(FilmsExtraList.MOST_COMMENTED, this._cardList.slice().sort((element1, element2) => element2.comments.length - element1.comments.length).splice(0, EXTRA_MOVIE_COUNT));
  }
}
