import AbstractView from './abstract.js';
import { getProfileRank } from '../utils/stats.js';

const createUserRankTemplate = (cards) => {
  const profileRating = getProfileRank(cards);
  return `<section class="header__profile profile">
    ${profileRating
    ? `<p class="profile__rating">${profileRating}</p><img class="profile__avatar" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">`
    : ''
}
  </section>`;
};

export default class Rank extends AbstractView {
  constructor(cards) {
    super();
    this._cards = cards;
  }

  getTemplate() {
    return createUserRankTemplate(this._cards);
  }
}
