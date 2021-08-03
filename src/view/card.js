import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);

export const createCardTemplate = (card) => {
  const filmInfo = card.film_info;
  const userDetails = card.user_details;
  const DEFAULT_INDEX = 0;
  const runTime = `${dayjs.duration(filmInfo.runtime, 'minutes').hours()}h ${dayjs.duration(filmInfo.runtime, 'minutes').minutes()}m`;

  const addWatchListClassName = userDetails.watchlist
    ? 'film-card__controls-item--active'
    : '';

  const watchedClassName = userDetails.already_watched
    ? 'film-card__controls-item--active'
    : '';

  const favoriteClassName = userDetails.favorite
    ? 'film-card__controls-item--active'
    : '';

  return `<article class="film-card">
    <h3 class="film-card__title">${filmInfo.title}</h3>
    <p class="film-card__rating">${filmInfo.total_rating}</p>
    <p class="film-card__info">
      <span class="film-card__year">${ dayjs(filmInfo.release['date']).year() }</span>
      <span class="film-card__duration">${runTime}m</span>
      <span class="film-card__genre">${filmInfo.genre[DEFAULT_INDEX]}</span>
    </p>
    <img src="${filmInfo.poster}" alt="" class="film-card__poster">
      <p class="film-card__description">${filmInfo.description}…</p>
      <a class="film-card__comments">${card.comments.length} comments</a>
      <div class="film-card__controls">
        <button class="film-card__controls-item film-card__controls-item--add-to-watchlist ${addWatchListClassName}" type="button">Add to watchlist</button>
        <button class="film-card__controls-item film-card__controls-item--mark-as-watched ${watchedClassName}" type="button">Mark as watched</button>
        <button class="film-card__controls-item film-card__controls-item--favorite ${favoriteClassName}" type="button">Mark as favorite</button>
      </div>
  </article>`;
};
