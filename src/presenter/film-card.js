import CardView from '../view/card.js';
import { UserAction, UpdateType } from '../const.js';
import {render, RenderPosition, replace, remove} from '../utils/render.js';

export default class Card {
  constructor(cardListContainer, changeData, openPopupHandler) {
    this._cardListContainer = cardListContainer;
    this._changeData = changeData;
    this._openPopupHandler = openPopupHandler;

    this._cardComponent = null;

    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleWatchlistClick = this._handleWatchlistClick.bind(this);
    this._handleHistoryClick = this._handleHistoryClick.bind(this);
  }

  init(card) {
    this._card = card;
    const prevCardComponent = this._cardComponent;
    this._cardComponent = new CardView(card);

    this._cardComponent.setOpenPopupHandler(this._openPopupHandler(this._card));
    this._cardComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._cardComponent.setWatchlistClickHandler(this._handleWatchlistClick);
    this._cardComponent.setHistoryClickHandler(this._handleHistoryClick);

    if (prevCardComponent === null || prevCardComponent === undefined) {
      render(this._cardListContainer, this._cardComponent, RenderPosition.BEFOREEND);
      return;
    }

    replace(this._cardComponent, prevCardComponent);
    remove(prevCardComponent);
  }

  destroy() {
    remove(this._cardComponent);
  }

  _handleFavoriteClick() {
    this._changeData(
      UserAction.UPDATE_CARD,
      UpdateType.PATCH,
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
      UserAction.UPDATE_CARD,
      UpdateType.PATCH,
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
      UserAction.UPDATE_CARD,
      UpdateType.PATCH,
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
