import UserRankView from './view/rank.js';
import FooterView from './view/footer.js';
import { render, RenderPosition } from './utils/render.js';
import { generateCard } from './mock/card-mock.js';
import CardsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import MoviePresenter from './presenter/film-board.js';
import FilterPresenter from './presenter/film-filter.js';

const MAIN_MOVIE_COUNT = 12;

const cardList = new Array(MAIN_MOVIE_COUNT).fill().map(generateCard);

const cardsModel = new CardsModel();
cardsModel.setCards(cardList);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer__statistics');

const moviePresenter = new MoviePresenter(siteMainElement, cardsModel, filterModel);
const filterPresenter = new FilterPresenter(siteMainElement, filterModel, cardsModel);

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);
//render(siteMainElement, new MenuView(cardList), RenderPosition.BEFOREEND);
//render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);
//renderFilms(siteMainElement, cardList);
render(siteFooterElement, new FooterView(cardList), RenderPosition.BEFOREEND);

filterPresenter.init();
moviePresenter.init();
