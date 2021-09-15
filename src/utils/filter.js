import { FilterType } from '../const';
//import { isTaskExpired, isTaskExpiringToday, isTaskRepeating } from './task';

export const filter = {
  [FilterType.ALL]: (cards) => cards.slice(),
  [FilterType.WATCHLIST]: (cards) => cards.filter((card) => card.isInWatchlist),
  [FilterType.HISTORY]: (cards) => cards.filter((card) => card.isAlreadyWatched),
  [FilterType.FAVORITES]: (cards) => cards.filter((card) => card.isFavorite),
};
