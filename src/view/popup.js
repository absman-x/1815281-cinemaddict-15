import SmartView from './smart.js';
import he from 'he';
import { UserAction, UpdateType } from '../const.js';
import { humanizeDate, convertToHoursDuration, convertToMinutesDuration, formatDateForComment } from '../utils/common.js';

const SHAKE_ANIMATION_TIMEOUT = 1000;

const createPopupTemplate = (card, comments) => {
  const { title, alternativeTitle, ageRating, totalRating, director, description, releaseDate, releaseCountry, writers, actors, genre, poster, runtime, isAlreadyWatched, isFavorite, isInWatchlist, emoji, commentText, isDeleting, isAdding, deletingId } = card;
  const commentsNumbers = card.comments;
  const runTime = `${convertToHoursDuration(runtime)}h ${convertToMinutesDuration(runtime)}m`;

  const genreAlias = genre.length !== 1
    ? 'Genres'
    : 'Genre';

  const filmsDetailsGenres = genre.map((element) => `<span class="film-details__genre">${element}</span>`);

  const addWatchListClassName = isInWatchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName = isAlreadyWatched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = isFavorite
    ? 'film-details__control-button--active'
    : '';

  const commentsLength = commentsNumbers.length;
  const generateCommentsClassNameElement = (comment) => {
    const formattedCommentDate = formatDateForComment(comment.date);
    return `
    <li class="film-details__comment">
      <span class="film-details__comment-emoji">
        <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji-${comment.emotion}">
      </span>
      <div>
        <p class="film-details__comment-text">${he.encode(comment.comment)}</p>
        <p class="film-details__comment-info">
          <span class="film-details__comment-author">${comment.author}</span>
          <span class="film-details__comment-day">${formattedCommentDate}</span>
          <button class="film-details__comment-delete" data-comment-id="${comment.id}" ${isDeleting ? 'disabled=\'disabled\' style=\'opacity: 0.5;\'' : ''}>
        ${isDeleting && deletingId === comment.id ? 'Deleting...' : 'Delete'}</button>
        </p>
      </div>
    </li>`;
  };
  const commentsClassName = comments.map((comment) => generateCommentsClassNameElement(comment));

  const isCheckedEmote = (emote) => (emote === emoji ? 'checked' : '');
  return `<section class="film-details">
            <form class="film-details__inner" action="" method="get">
              <div class="film-details__top-container">
                <div class="film-details__close">
                  <button class="film-details__close-btn" type="button">close</button>
                </div>
                <div class="film-details__info-wrap">
                  <div class="film-details__poster">
                    <img class="film-details__poster-img" src="${poster}" alt="">
                    <p class="film-details__age">${ageRating}+</p>
                  </div>
                  <div class="film-details__info">
                    <div class="film-details__info-head">
                      <div class="film-details__title-wrap">
                        <h3 class="film-details__title">${title}</h3>
                        <p class="film-details__title-original">Original: ${alternativeTitle}</p>
                      </div>
                      <div class="film-details__rating">
                        <p class="film-details__total-rating">${totalRating}</p>
                      </div>
                    </div>
                    <table class="film-details__table">
                      <tr class="film-details__row">
                        <td class="film-details__term">Director</td>
                        <td class="film-details__cell">${director}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Writers</td>
                        <td class="film-details__cell">${writers.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Actors</td>
                        <td class="film-details__cell">${actors.join(', ')}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Release Date</td>
                        <td class="film-details__cell">${humanizeDate(releaseDate)}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Runtime</td>
                        <td class="film-details__cell">${runTime}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">Country</td>
                        <td class="film-details__cell">${releaseCountry}</td>
                      </tr>
                      <tr class="film-details__row">
                        <td class="film-details__term">${genreAlias}</td>
                        <td class="film-details__cell">
                          ${filmsDetailsGenres.join('')}
                      </tr>
                    </table>
                    <p class="film-details__film-description">
                      ${description}
                    </p>
                  </div>
                </div>
                <section class="film-details__controls">
                  <button type="button" class="film-details__control-button ${addWatchListClassName} film-details__control-button--watchlist" id="watchlist" name="watchlist">Add to watchlist</button>
                  <button type="button" class="film-details__control-button ${watchedClassName} film-details__control-button--watched" id="watched" name="watched">Already watched</button>
                  <button type="button" class="film-details__control-button ${favoriteClassName} film-details__control-button--favorite" id="favorite" name="favorite">Add to favorites</button>
                </section>
              </div>
              <div class="film-details__bottom-container">
                <section class="film-details__comments-wrap">
                  <h3 class="film-details__comments-title">Comments <span class="film-details__comments-count">${commentsLength}</span></h3>
                  <ul class="film-details__comments-list">
                    ${commentsClassName.join('')}
                  </ul>
                  <div class="film-details__new-comment">
                    <div class="film-details__add-emoji-label">${emoji !== undefined ? `<img src="./images/emoji/${emoji}.png" width="55" height="55" alt="emoji-${emoji}">` : ''}</div>
                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment" ${isAdding ? 'disabled=\'disabled\' style=\'opacity: 0.5;\'' : ''}>${commentText !== undefined ? `${he.encode(commentText)}` : ''}</textarea>
                    </label>
                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile" ${isCheckedEmote('smile')} ${isAdding ? 'disabled=\'disabled\'' : ''}>
                        <label class="film-details__emoji-label" for="emoji-smile">
                          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                        </label>
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping" ${isCheckedEmote('sleeping')} ${isAdding ? 'disabled=\'disabled\'' : ''}>
                        <label class="film-details__emoji-label" for="emoji-sleeping">
                          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                        </label>
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke" ${isCheckedEmote('puke')} ${isAdding ? 'disabled=\'disabled\'' : ''}>
                        <label class="film-details__emoji-label" for="emoji-puke">
                          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                        </label>
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry" ${isCheckedEmote('angry')} ${isAdding ? 'disabled=\'disabled\'' : ''}>
                        <label class="film-details__emoji-label" for="emoji-angry">
                          <img src="./images/emoji/angry.png" width="30" height="30" alt="emoji">
                        </label>
                    </div>
                  </div>
                </section>
              </div>
            </form>
          </section>`;
};

export default class Popup extends SmartView {
  constructor(card, changeData, cardComments) {
    super();
    this._offset;
    this._data = card;
    this._comments = cardComments;
    this._changeData = changeData;
    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._watchlistPopupClickHandler = this._watchlistPopupClickHandler.bind(this);
    this._historyPopupClickHandler = this._historyPopupClickHandler.bind(this);
    this._favoritePopupClickHandler = this._favoritePopupClickHandler.bind(this);

    this._emoteListClickHandler = this._emoteListClickHandler.bind(this);
    this._newCommentTextHandler = this._newCommentTextHandler.bind(this);

    this._newCommentSubmitHandler = this._newCommentSubmitHandler.bind(this);
    this._commentsDeleteClickHandler = this._commentsDeleteClickHandler.bind(this);
    this._setInnerHandlers();
  }

  getTemplate() {
    return createPopupTemplate(this._data, this._comments);
  }

  restoreHandlers() {
    this._setInnerHandlers();
  }

  setOffset(offset) {
    this._offset = offset;
  }

  getOffset() {
    return this._offset;
  }

  _setInnerHandlers() {
    this._setCommentDeleteHandler();
    this._setEmoteInputHandler();
    this._setAddCommentHandler();
    this.setFormSubmitHandler();
    this.setClosePopupHandler(this._callback.closePopupClick);
    this.setFavoritePopupClickHandler();
    this.setHistoryPopupClickHandler();
    this.setWatchlistPopupClickHandler();
  }

  _getScrollTop() {
    return this.getElement().scrollTop;
  }

  _setScrollByTop(scrollTopValue) {
    this.getElement().scrollBy(0, scrollTopValue, 0);
  }

  updateComments(update, justDataUpdating) {
    if (!update) {
      return;
    }

    this._comments = update;

    if (justDataUpdating) {
      return;
    }

    this.updateElement();
  }

  _closePopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.closePopupClick();
  }


  setClosePopupHandler(callback) {
    this._callback.closePopupClick = callback;
    this.getElement().querySelector('.film-details__close-btn').addEventListener('click', this._closePopupClickHandler);
  }

  _watchlistPopupClickHandler(evt) {
    evt.preventDefault();
    const scrollTop = this._getScrollTop();
    this._changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._data,
        { isInWatchlist: !this._data.isInWatchlist },
      ),
    );
    this.updateData({
      isInWatchlist: !this._data.isInWatchlist,
    }, false);
    this._setScrollByTop(scrollTop);
  }

  setWatchlistPopupClickHandler() {
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistPopupClickHandler);
  }

  _historyPopupClickHandler(evt) {
    evt.preventDefault();
    const scrollTop = this._getScrollTop();
    this._changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._data,
        { isAlreadyWatched: !this._data.isAlreadyWatched },
      ),
    );
    this.updateData({
      isAlreadyWatched: !this._data.isAlreadyWatched,
    }, false);
    this._setScrollByTop(scrollTop);
  }

  setHistoryPopupClickHandler() {
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._historyPopupClickHandler);
  }

  _favoritePopupClickHandler(evt) {
    evt.preventDefault();
    const scrollTop = this._getScrollTop();
    this._changeData(
      UserAction.UPDATE_CARD,
      UpdateType.MINOR,
      Object.assign(
        {},
        this._data,
        {isFavorite: !this._data.isFavorite},
      ),
    );
    this.updateData({
      isFavorite: !this._data.isFavorite,
    }, false);
    this._setScrollByTop(scrollTop);
  }

  setFavoritePopupClickHandler() {
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoritePopupClickHandler);
  }

  _setCommentDeleteHandler() {
    this.getElement().querySelectorAll('.film-details__comment-delete').forEach((it) => it.addEventListener('click', this._commentsDeleteClickHandler));
  }

  _setEmoteInputHandler() {
    this.getElement().querySelectorAll('.film-details__emoji-item').forEach((it) => it.addEventListener('input', this._emoteListClickHandler));
  }

  _setAddCommentHandler() {
    this.getElement().querySelector('.film-details__comment-input').addEventListener('input', this._newCommentTextHandler);
  }

  _commentsDeleteClickHandler(evt) {
    evt.preventDefault();
    const scrollTop = this._getScrollTop();
    const commentId = parseInt(evt.target.dataset.commentId, 10);
    if (commentId) {
      this._changeData(
        UserAction.DELETE_COMMENT,
        UpdateType.MINOR,
        { id: this._data.id, commentId },
      );
    }
    this._setScrollByTop(scrollTop);
  }

  _emoteListClickHandler(evt) {
    evt.preventDefault();
    const scrollTop = this._getScrollTop();
    this._emoji = evt.target.value;
    this.updateData({
      emoji: evt.target.value,
    }, false);
    this._setScrollByTop(scrollTop);
  }

  _newCommentTextHandler(evt) {
    evt.preventDefault();
    const scrollTop = this._getScrollTop();
    this._commentText = evt.target.value;
    this.updateData({
      commentText: evt.target.value,
    }, true);

    this._setScrollByTop(scrollTop);
  }

  _deleteComment(deletedComment) {
    const index = this._comments.findIndex((comment) => parseInt(comment.id, 10) === deletedComment);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    this._comments = [
      ...this._comments.slice(0, index),
      ...this._comments.slice(index + 1),
    ];
  }

  _newCommentSubmitHandler(evt) {
    if (evt.key === 'Enter' && (evt.metaKey || evt.ctrlKey)) {
      if (!this._emoji || !this._commentText) {
        return;
      }
      evt.preventDefault();
      const scrollTop = this._getScrollTop();

      this.updateData({
        commentText: '',
        emoji: undefined,
      }, false);

      const dataComment = {
        cardId: this._data.id,
        localComment: {
          emotion: this._emoji,
          comment: this._commentText,
        },
      };

      this._changeData(
        UserAction.ADD_COMMENT,
        UpdateType.MINOR,
        dataComment,
      );

      this._setScrollByTop(scrollTop);
    }

  }

  setFormSubmitHandler(callback) {
    this._callback.formSubmit = callback;
    this.getElement().querySelector('.film-details__inner').addEventListener('keydown', this._newCommentSubmitHandler);
  }

  shakeAdd({ resetState = false } = {}) {
    const posTop = this.getElement().scrollTop;
    const element = document.querySelector('.film-details__new-comment');
    element.style.animation = `shake ${SHAKE_ANIMATION_TIMEOUT / 1000}s`;
    setTimeout(() => {
      element.style.animation = '';
      if (resetState) {
        this._resetFormState();
      }
      this.getElement().scrollTop = posTop;
    }, SHAKE_ANIMATION_TIMEOUT);
  }
}
