import AbstractView from './abstract.js';
import { humanizeDate, convertToHoursDuration, convertToMinutesDuration, formatDateForComment } from '../utils/common.js';

const createPopupTemplate = (card, comments) => {
  const { title, alternativeTitle, ageRating, totalRating, director, description, releaseDate, releaseCountry, writers, actors, genre, poster, runtime, isAlreadyWatched, isFavorite, isInWatchlist } = card;
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
    return `<li class="film-details__comment">
              <span class="film-details__comment-emoji">
                <img src="./images/emoji/${comment.emotion}.png" width="55" height="55" alt="emoji - ${comment.emotion} ">
              </span>
              <div>
                <p class="film-details__comment-text">${comment.comment}</p>
                <p class="film-details__comment-info">
                  <span class="film-details__comment-author">${comment.author}</span>
                  <span class="film-details__comment-day">${formattedCommentDate}</span>
                  <button class="film-details__comment-delete">Delete</button>
                 </p>
               </div>
            </li>`;
  };
  const commentsClassName = comments.map((comment) => generateCommentsClassNameElement(comment));

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
                    <div class="film-details__add-emoji-label"></div>
                    <label class="film-details__comment-label">
                      <textarea class="film-details__comment-input" placeholder="Select reaction below and write comment here" name="comment"></textarea>
                    </label>
                    <div class="film-details__emoji-list">
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-smile" value="smile">
                        <label class="film-details__emoji-label" for="emoji-smile">
                          <img src="./images/emoji/smile.png" width="30" height="30" alt="emoji">
                        </label>
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-sleeping" value="sleeping">
                        <label class="film-details__emoji-label" for="emoji-sleeping">
                          <img src="./images/emoji/sleeping.png" width="30" height="30" alt="emoji">
                        </label>
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-puke" value="puke">
                        <label class="film-details__emoji-label" for="emoji-puke">
                          <img src="./images/emoji/puke.png" width="30" height="30" alt="emoji">
                        </label>
                      <input class="film-details__emoji-item visually-hidden" name="comment-emoji" type="radio" id="emoji-angry" value="angry">
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

export default class Popup extends AbstractView {
  constructor(card, comments) {
    super();
    this._card = card;
    this._comments = comments;
    this._closePopupClickHandler = this._closePopupClickHandler.bind(this);
    this._watchlistPopupClickHandler = this._watchlistPopupClickHandler.bind(this);
    this._historyPopupClickHandler = this._historyPopupClickHandler.bind(this);
    this._favoritePopupClickHandler = this._favoritePopupClickHandler.bind(this);
  }

  getTemplate() {
    return createPopupTemplate(this._card, this._comments);
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
    this._callback.watchlistPopupClick();
  }

  setWatchlistPopupClickHandler(callback) {
    this._callback.watchlistPopupClick = callback;
    this.getElement().querySelector('.film-details__control-button--watchlist').addEventListener('click', this._watchlistPopupClickHandler);
  }

  _historyPopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.historyPopupClick();
  }

  setHistoryPopupClickHandler(callback) {
    this._callback.historyPopupClick = callback;
    this.getElement().querySelector('.film-details__control-button--watched').addEventListener('click', this._historyPopupClickHandler);
  }

  _favoritePopupClickHandler(evt) {
    evt.preventDefault();
    this._callback.favoritePopupClick();
  }

  setFavoritePopupClickHandler(callback) {
    this._callback.favoritePopupClick = callback;
    this.getElement().querySelector('.film-details__control-button--favorite').addEventListener('click', this._favoritePopupClickHandler);
  }
}
