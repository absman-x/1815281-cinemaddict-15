import { createUserRankTemplate } from './view/rank.js';
import { createMenuTemplate } from './view/menu.js';
import { createFilmsContainerTemplate } from './view/films.js';
import { createFilmsExtraContainerTemplate } from './view/films-extra.js';
import { createCardTemplate } from './view/card.js';
import { createShowMoreButtonTemplate } from './view/show-more-button.js';
import { createPopupTemplate } from './view/popup.js';

const MAIN_MOVIE_COUNT = 5;
const EXTRA_MOVIE_COUNT = 2;

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');

render(siteHeaderElement, createUserRankTemplate(), 'beforeend');
render(siteMainElement, createMenuTemplate(), 'beforeend');
render(siteMainElement, createFilmsContainerTemplate(), 'beforeend');

const siteFilmsElement = siteMainElement.querySelector('.films');
const siteFilmsListElement = siteFilmsElement.querySelector('.films-list__container');

for (let i = 0; i < MAIN_MOVIE_COUNT; i++) {
  render(siteFilmsListElement, createCardTemplate(), 'beforeend');
}

const siteButtonElement = siteFilmsElement.querySelector('.films-list');
render(siteButtonElement, createShowMoreButtonTemplate(), 'beforeend');

render(siteFilmsElement, createFilmsExtraContainerTemplate('Top rated'), 'beforeend');
render(siteFilmsElement, createFilmsExtraContainerTemplate('Most commented'), 'beforeend');
const siteFilmsExtraElement = siteFilmsElement.querySelectorAll('.films-list--extra');

const siteFilmsTopRatedElement = siteFilmsExtraElement[0];
const siteFilmsTopRatedListElement = siteFilmsTopRatedElement.querySelector('.films-list__container');
for (let i = 0; i < EXTRA_MOVIE_COUNT; i++) {
  render(siteFilmsTopRatedListElement, createCardTemplate(), 'beforeend');
}

const siteFilmsMostCommentedElement = siteFilmsExtraElement[1];
const siteFilmsMostCommentedListElement = siteFilmsMostCommentedElement.querySelector('.films-list__container');
for (let i = 0; i < EXTRA_MOVIE_COUNT; i++) {
  render(siteFilmsMostCommentedListElement, createCardTemplate(), 'beforeend');
}

const siteBodyElement = document.body;
render(siteBodyElement, createPopupTemplate(), 'beforeend');
