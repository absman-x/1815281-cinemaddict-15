import CardView from '../view/card.js';
import PopupView from '../view/popup.js';
import { checkEscEvent } from '../utils/common.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

const Mode = {
  DEFAULT: 'DEFAULT',
  POPUP: 'POPUP',
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
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(card, comments) {
    this._card = card;
    const prevCardComponent = this._cardComponent;
    const prevPopupComponent = this._popupComponent;

    this._cardComponent = new CardView(card);
    //this._popupComments = (this._card.comments).map((id) => generateComment(id));
    if (comments !== undefined) {
      this._popupComments = comments;
    }
    this._popupComponent = new PopupView(this._card, this._popupComments);

    this._cardComponent.setOpenPopupHandler(this._handleOpenPopupClick);//this._handleEditClick);
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);//this._handleArchiveClick
    this._cardComponent.setHistoryClickHandler(this._handleHistoryClick);


    if (prevCardComponent === null || prevPopupComponent === null) {
      render(this._cardListContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._cardComponent, prevCardComponent);
    }

    if (this._mode === Mode.POPUP) {
      replace(this._cardComponent, prevCardComponent);
      this._handleOpenPopupClick();
    }

    remove(prevCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
    if (this._mode === Mode.POPUP) {
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
    if (checkEscEvent(evt)) {
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
    document.addEventListener('keydown', this._escKeyDownHandler);
    this._changeMode();
    this._mode = Mode.POPUP;
    this._popupComponent.setClosePopupHandler(() => {
      this._handleClosePopupClick();
    });
    siteBodyElement.appendChild(this._currentPopup);
    siteBodyElement.classList.add('hide-overflow');
  }

  _handleClosePopupClick() {
    document.removeEventListener('keydown', this._escKeyDownHandler);
    siteBodyElement.removeChild(this._currentPopup);
    siteBodyElement.classList.remove('hide-overflow');
    this._mode = Mode.DEFAULT;
    this._currentPopup = null;
  }

  _handleFavoriteClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          isFavorite : !this._card.isFavorite,
        },
      ),
    );
  }

  _handleWatchlistClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          isInWatchlist: !this._card.isInWatchlist,
        },
      ),
    );
  }

  _handleHistoryClick() {
    this._changeData(
      Object.assign(
        {},
        this._card,
        {
          isAlreadyWatched : !this._card.isAlreadyWatched,
        },
      ),
    );
  }

}
