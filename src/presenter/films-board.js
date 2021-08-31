import MenuView from '../view/menu.js';
import SortView from '../view/sort.js';
import FilmsView from '../view/films.js';
import FilmsListView from '../view/films-list.js';
import NoFilmsView from '../view/no-films.js';
import ExtraView from '../view/films-extra.js';
import CardView from '../view/card.js';
import ShowMoreButtonView from '../view/show-more-button.js';
import PopupView from '../view/popup.js';
import { render, RenderPosition, remove } from '../utils/render.js';
//не должно быть в presenter?
import { generateComment } from '../mock/comment-mock.js';

const MOVIE_COUNT_PER_STEP = 5;
const EXTRA_MOVIE_COUNT = 2;
const PopupStatus = {
  CLOSED: 'CLOSED',
  OPENED: 'OPENED',
};
const FilmsExtraList = {
  TOP_RATED: 'Top rated',
  MOST_COMMENTED: 'Most commented',
};
const siteBodyElement = document.body;

export default class Movie {
  constructor(movieContainer) {
    this._movieContainer = movieContainer;
    this._renderedCardCount = MOVIE_COUNT_PER_STEP;
    this._popupStatus = PopupStatus.CLOSED;
    this._filmsComponent = new FilmsView();
    //this._menuComponent = new MenuView(cardList);
    this._sortComponent = new SortView();
    this._filmsListComponent = new FilmsListView();
    this._noFilmsComponent = new NoFilmsView();
    this._showMoreButtonComponent = new ShowMoreButtonView();

    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
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

  _renderCard(component, card) {
    // Метод, куда уйдёт логика созданию и рендерингу компонетов задачи,
    // текущая функция renderTask в main.js
    this._card = card;
    this._cardComponent = new CardView(this._card);
    this._popupComments = (this._card.comments).map((id) => generateComment(id));
    this._component = component;

    this._cardComponent.setOpenPopupHandler(() => {
      this._showPopup(this._card, this._popupComments);
      document.addEventListener('keydown', this._escKeyDownHandler);
    });

    render(this._component, this._cardComponent, RenderPosition.BEFOREEND);
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._closePopup();
    }
  }

  _showPopup(card, popupComments) {
    this._card = card;
    this._popupCommenst = popupComments;
    this._popupComponent = new PopupView(this._card, this._popupCommenst);

    if (this._popupStatus !== PopupStatus.CLOSED) {
      this._closePopup();
    }
    //openedPopup = this._popupComponent;
    this._popupStatus = PopupStatus.OPENED;
    siteBodyElement.appendChild(this._popupComponent.getElement());
    siteBodyElement.classList.add('hide-overflow');

    this._popupComponent.setClosePopupHandler(() => {
      this._closePopup();
    });
  }

  _closePopup() {
    document.removeEventListener('keydown', this._escKeyDownHandler);
    siteBodyElement.removeChild(this._popupComponent.getElement());
    siteBodyElement.classList.remove('hide-overflow');
    this._popupStatus = PopupStatus.CLOSED;
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

  _renderShowMoreButton() {
    // Метод, куда уйдёт логика по отрисовке кнопки допоказа задач,
    // сейчас в main.js является частью renderBoard
    render(this._noFilmsComponent, this._showMoreButtonComponent, RenderPosition.BEFOREEND);

    this._showMoreButtonComponent.setClickHandler(this._handleShowMoreButtonClick);
  }

  _renderCardsList() {
    //render(this._filmsComponent, this._noFilmsComponent, RenderPosition.AFTERBEGIN);
    //render(this._noFilmsComponent, this._filmsListComponent, RenderPosition.BEFOREEND);
    this._renderCards(0, Math.min(this._cardList.length, MOVIE_COUNT_PER_STEP));

    if (this._cardList.length > MOVIE_COUNT_PER_STEP) {
      this._renderShowMoreButton();
    }
  }

  _renderExtraCardsList(extraListType) {
    this._extraCardsListElement = new ExtraView(extraListType);
    render(this._filmsComponent, this._extraCardsListElement, RenderPosition.BEFOREEND);
    this.__extraCardsListComponent = new FilmsListView();
    render(this._extraCardsListElement, this.__extraCardsListComponent, RenderPosition.BEFOREEND);
    if (extraListType === FilmsExtraList.MOST_COMMENTED) {this._extraCards = this._cardList.slice().sort((element1, element2) => element2.comments.length - element1.comments.length).splice(0, EXTRA_MOVIE_COUNT);}
    if (extraListType === FilmsExtraList.TOP_RATED) {this._extraCards = this._cardList.slice().sort((element1, element2) => element2.filmInfo.totalRating - element1.filmInfo.totalRating).splice(0, EXTRA_MOVIE_COUNT);}
    this._extraCards.forEach((card) => this._renderCard(this.__extraCardsListComponent, card));
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
    this._renderExtraCardsList(FilmsExtraList.TOP_RATED);
    this._renderExtraCardsList(FilmsExtraList.MOST_COMMENTED);
  }
}
