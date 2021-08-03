import { generateComment } from '../mock/comment-mock.js';
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);
import { humanizeTaskDueDate } from '../utils.js';

export const createPopupTemplate = (card) => {
  const filmInfo = card.film_info;
  const userDetails = card.user_details;
  const commentsNumbers = card.comments;
  const runTime = `${dayjs.duration(filmInfo.runtime, 'minutes').hours()}h ${dayjs.duration(filmInfo.runtime, 'minutes').minutes()}m`;

  const filmGenre = filmInfo.genre;
  const genreCount = filmGenre.length !== 1
    ? 's'
    : '';

  const filmsDetailsGenres = [];
  for (let i = 0; i < filmGenre.length; i++) {
    filmsDetailsGenres.push(`<span class="film-details__genre">${filmGenre[i]}</span>`);
  }

  const addWatchListClassName = userDetails.watchlist
    ? 'film-details__control-button--active'
    : '';

  const watchedClassName = userDetails.already_watched
    ? 'film-details__control-button--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-details__control-button--active'
    : '';

  const commentsLength = commentsNumbers.length;
  const commentsList = new Array(commentsLength).fill().map(generateComment);
  const commentsClass = [];
  for (let i = 0; i < commentsLength; i++) {
    const commentDate = commentsList[i].date;
    let commentDateText;
    if (dayjs(commentDate).isToday()) {
      commentDateText = 'Today';
    } else {
      commentDateText = dayjs(commentDate).fromNow();
    }
    commentsClass.push(`<li class="film-details__comment">
                  <span class="film-details__comment-emoji">
                    <img src="./images/emoji/${commentsList[i].emotion}.png" width="55" height="55" alt="emoji-${commentsList[i].emotion}">
              </span>
                    <div>
                      <p class="film-details__comment-text">${commentsList[i].comment}</p>
                      <p class="film-details__comment-info">
                        <span class="film-details__comment-author">${commentsList[i].author}</span>
                        <span class="film-details__comment-day">${commentDateText}</span>
                        <button class="film-details__comment-delete">Delete</button>
                      </p>
                    </div>
            </li>`);
  }

  return `<section class="film-details">
    <form class="film-details__inner" action="" method="get">
      <div class="film-details__top-container">
        <div class="film-details__close">
          <button class="film-details__close-btn" type="button">close</button>
        </div>
        <div class="film-details__info-wrap">
          <div class="film-details__poster">
            <img class="film-details__poster-img" src="${filmInfo.poster}" alt="">

              <p class="film-details__age">${filmInfo.age_rating}+</p>
          </div>

            <div class="film-details__info">
              <div class="film-details__info-head">
                <div class="film-details__title-wrap">
                  <h3 class="film-details__title">${filmInfo.title}</h3>
                  <p class="film-details__title-original">Original: ${filmInfo.alternative_title}</p>
                </div>

                <div class="film-details__rating">
                  <p class="film-details__total-rating">${filmInfo.total_rating}</p>
                </div>
              </div>

              <table class="film-details__table">
                <tr class="film-details__row">
                  <td class="film-details__term">Director</td>
                  <td class="film-details__cell">${filmInfo.director}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Writers</td>
                  <td class="film-details__cell">${filmInfo.writers.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Actors</td>
                  <td class="film-details__cell">${filmInfo.actors.join(', ')}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Release Date</td>
                  <td class="film-details__cell">${humanizeTaskDueDate(filmInfo.release['date'])}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Runtime</td>
                  <td class="film-details__cell">${runTime}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Country</td>
                  <td class="film-details__cell">${filmInfo.release['release_country']}</td>
                </tr>
                <tr class="film-details__row">
                  <td class="film-details__term">Genre${genreCount}</td>
                  <td class="film-details__cell">
                    ${filmsDetailsGenres.join('')}
                </tr>
              </table>

              <p class="film-details__film-description">
                ${filmInfo.description}
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
              ${commentsClass.join('')}
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
