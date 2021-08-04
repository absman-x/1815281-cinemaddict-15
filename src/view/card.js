import dayjs from 'dayjs';
import { convertToHoursDuration, convertToMinutesDuration } from '../utils.js';

export const createCardTemplate = (card) => {
  const DEFAULT_INDEX = 0;
  const MAX_DESCRIPTION_LENGTH = 140;
  const DESCRIPTION_SHOWN_LENGTH = 139;
  const filmInfo = card.filmInfo;
  const userDetails = card.userDetails;
  const runTime = `${convertToHoursDuration(filmInfo.runtime)}h ${convertToMinutesDuration(filmInfo.runtime)}m`;
  const filmDescription = filmInfo.description;
  const descriptionAlias = (filmDescription.length > MAX_DESCRIPTION_LENGTH)
    ? `${filmDescription.substring(0, DESCRIPTION_SHOWN_LENGTH)}…`
    : filmDescription;

  const addWatchListClassName = userDetails.watchlist
    ? 'film-card__controls-item--active'
    : '';

  const watchedClassName = userDetails.alreadyWatched
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-card__controls-item--active'
    : '';

  return `<article class="film-card">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.totalRating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${ dayjs(filmInfo.release['date']).year() }</span>
      <span class="film-card__duration">${runTime}</span>
      <span class="film-card__genre">${filmInfo.genre[DEFAULT_INDEX]}</span>
    </p>
    <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${descriptionAlias}</p>
      <a class="film-card__comments">${card.comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addWatchListClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
  </article>`;
};
