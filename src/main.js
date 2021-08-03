import { createUserRankTemplate } from './view/rank.js';
import { createMenuTemplate } from './view/menu.js';
import { createFilmsContainerTemplate } from './view/films.js';
import { createFilmsExtraContainerTemplate } from './view/films-extra.js';
import { createCardTemplate } from './view/card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createPopupTemplate } from './view/popup.js';
import { generateCard } from './mock/card-mock.js';

const MAIN_MOVIE_COUNT = 7;
const EXTRA_MOVIE_COUNT = 2;
const MOVIE_POPUP_INDEX = 0;
const MOVIE_COUNT_PER_STEP = 5;
const TOP_RATED_INDEX = 0;
const MOST_COMMENTED_INDEX = 1;

const cardList = new Array(MAIN_MOVIE_COUNT).fill().map(generateCard);

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(cardList), 'beforeend');
render(siteMainElement, createFilmsContainerTemplate(), 'beforeend');

const siteFilmsElement = siteMainElement.querySelector('.films');
const siteFilmsListElement = siteFilmsElement.querySelector('.films-list__container');
const siteButtonElement = siteFilmsElement.querySelector('.films-list');

for (let i = 0; i < MOVIE_COUNT_PER_STEP; i++) {
  const firstCards = createCardTemplate(cardList[i]);
  render(siteFilmsListElement, firstCards, 'beforeend');
}

if (cardList.length > MOVIE_COUNT_PER_STEP) {
  let renderedMovieCount = MOVIE_COUNT_PER_STEP;

  render(siteButtonElement, createShowMoreButtonTemplate(), 'beforeend');

  const showMoreButton = siteButtonElement.querySelector('.films-list__show-more');

  showMoreButton.addEventListener('click', (evt) => {
    evt.preventDefault();
    cardList
      .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
      .forEach((card) => render(siteFilmsListElement, createCardTemplate(card), 'beforeend'));

    renderedMovieCount += MOVIE_COUNT_PER_STEP;

    if (renderedMovieCount >= cardList.length) {
      showMoreButton.remove();
    }
  });
}

render(siteFilmsElement, createFilmsExtraContainerTemplate('Top rated'), 'beforeend');
render(siteFilmsElement, createFilmsExtraContainerTemplate('Most commented'), 'beforeend');
const siteFilmsExtraElement = siteFilmsElement.querySelectorAll('.films-list--extra');

const siteFilmsTopRatedElement = siteFilmsExtraElement[TOP_RATED_INDEX];
const siteFilmsTopRatedListElement = siteFilmsTopRatedElement.querySelector('.films-list__container');
for (let i = 0; i < EXTRA_MOVIE_COUNT; i++) {
  render(siteFilmsTopRatedListElement, createCardTemplate(generateCard()), 'beforeend');
}

const siteFilmsMostCommentedElement = siteFilmsExtraElement[MOST_COMMENTED_INDEX];
const siteFilmsMostCommentedListElement = siteFilmsMostCommentedElement.querySelector('.films-list__container');
for (let i = 0; i < EXTRA_MOVIE_COUNT; i++) {
  render(siteFilmsMostCommentedListElement, createCardTemplate(generateCard()), 'beforeend');
}

const siteBodyElement = document.body;
render(siteBodyElement, createPopupTemplate(cardList[MOVIE_POPUP_INDEX]), 'beforeend');

const siteFooterElement = document.querySelector('.footer__statistics');
siteFooterElement.insertAdjacentHTML('beforeend', `<p>${cardList.length} movies inside</p>`);
