import UserRankView from './view/rank.js';
import FooterView from './view/footer.js';
import { render, RenderPosition } from './utils/render.js';
import { generateCard } from './mock/card-mock.js';
import MoviePresenter from './presenter/film-board.js';

const MAIN_MOVIE_COUNT = 12;

const cardList = new Array(MAIN_MOVIE_COUNT).fill().map(generateCard);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer__statistics');

const moviePresenter = new MoviePresenter(siteMainElement);

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);
//render(siteMainElement, new MenuView(cardList), RenderPosition.BEFOREEND);
//render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);
//renderFilms(siteMainElement, cardList);
render(siteFooterElement, new FooterView(cardList), RenderPosition.BEFOREEND);

moviePresenter.init(cardList);
