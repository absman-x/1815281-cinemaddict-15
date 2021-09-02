import CardView from '../view/card.js';
import PopupView from '../view/popup.js';
//import CardEditView from '../view/card-edit.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';
import { generateComment } from '../mock/comment-mock.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP_OPEN: 'POPUP_OPEN',
};

const siteBodyElement = document.body;

export default class Card {
  constructor(cardListContainer, changeData, changeMode) {
    this._cardListContainer = cardListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._cardComponent = null;
    this._cardEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleOpenPopupClick = this._handleOpenPopupClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
    //this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
    //this._handleFavoritePopupClick = this._handleFavoritePopupClick.bind(this);
  }

  init(card) {
    this._card = card;
    const prevCardComponent = this._cardComponent;
    //const prevCardEditComponent = this._cardEditComponent;

    this._cardComponent = new CardView(card);
    this._popupComments = (this._card.comments).map((id) => generateComment(id));
    this._popupComponent = new PopupView(this._card, this._popupComments);
    //this._cardEditComponent = new CardEditView(card);

    this._cardComponent.setOpenPopupHandler(this._handleOpenPopupClick);//this._handleEditClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);//this._handleArchiveClick
    this._cardComponent.setHistoryClickHandler(this._handleHistoryClick);// нет обработчика this._handleArchiveClick
    //this._cardEditComponent.setFormSubmitHandler(this._handleFormSubmit);

    if (prevCardComponent === null) {// || prevCardEditComponent === null) {
      render(this._cardListContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._mode === Mode.POPUP_OPEN) {
      replace(this._cardComponent, prevCardComponent);
      this._handleOpenPopupClick();
    }

    remove(prevCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
    if (this._mode === Mode.POPUP_OPEN) {
      //replace(this._cardComponent, prevCardComponent);
      this._handleClosePopupClick();
    }
    //remove(this._cardEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._handleClosePopupClick();
    }
  }

  _escKeyDownHandler(evt) {
    if (evt.key === 'Escape' || evt.key === 'Esc') {
      evt.preventDefault();
      this._handleClosePopupClick();
    }
  }

  _handleOpenPopupClick() {
    if (this._currentPopup) { this._handleClosePopupClick(); }

    this._currentPopup = this._popupComponent.getElement();
    this._popupComponent.setFavoritePopupClickHandler(this._handleFavoriteClick);
    this._popupComponent.setWatchlistPopupClickHandler(this._handleWatchlistClick);
    this._popupComponent.setHistoryPopupClickHandler(this._handleHistoryClick);
    siteBodyElement.appendChild(this._currentPopup);
    siteBodyElement.classList.add('hide-overflow');
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.POPUP_OPEN;
    this._popupComponent.setClosePopupHandler(() => {
      this._handleClosePopupClick();
    });
  }

  _handleClosePopupClick() {
    document.removeEventListener('keydown', this._escKeyDownHandler);
    siteBodyElement.removeChild(this._currentPopup);
    siteBodyElement.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
    this._currentPopup = undefined;
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        this._card.userDetails.favorite = !this._card.userDetails.favorite,
      ),
    );
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        this._card.userDetails.watchlist = !this._card.userDetails.watchlist,
      ),
    );
  }

  _handleHistoryClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        this._card.userDetails.alreadyWatched = !this._card.userDetails.alreadyWatched,
      ),
    );
  }

  _handleFormSubmit(card) {
    this._changeData(card);
    this._replaceFormToCard();
  }
}
