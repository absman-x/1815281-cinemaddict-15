import UserRankView from './view/rank.js';
import FooterView from './view/footer.js';
import StatisticsView from './view/statistics.js';
import { render, RenderPosition, remove } from './utils/render.js';
//import { generateCard } from './mock/card-mock.js';
import CardsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import MoviePresenter from './presenter/movie-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import Api from './api/api.js';
import { MenuItem, UpdateType } from './const.js';

//const MAIN_MOVIE_COUNT = 12;

const AUTHORIZATION = 'Basic 298aer48zzs9r';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict/';

const api = new Api(END_POINT, AUTHORIZATION);

//const cardList = new Array(MAIN_MOVIE_COUNT).fill().map(generateCard);

const cardsModel = new CardsModel();
//cardsModel.setCards(cardList);

const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer__statistics');
render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);

let statisticsComponent = null;
let currentMenuItem = MenuItem.MOVIES;


const moviePresenter = new MoviePresenter(siteMainElement, cardsModel, filterModel, api);
// debugger;
const handleSiteMenuClick = (menuItem) => {
  if (currentMenuItem === menuItem) {
    return;
  }
  switch (menuItem) {
    case MenuItem.MOVIES:
      moviePresenter.init();
      remove(statisticsComponent);
      currentMenuItem = MenuItem.MOVIES;
      document.querySelector('.main-navigation__additional').classList.remove('main-navigation__additional--active');
      break;
    case MenuItem.STATISTICS:
      moviePresenter.destroy();
      statisticsComponent = new StatisticsView(cardsModel.getCards());
      render(siteMainElement, statisticsComponent, RenderPosition.BEFOREEND);
      currentMenuItem = MenuItem.STATISTICS;
      document.querySelector('.main-navigation__additional').classList.add('main-navigation__additional--active');
      break;
  }
};

const filterPresenter = new FilterPresenter(siteMainElement, filterModel, cardsModel, handleSiteMenuClick);
//render(siteMainElement, new MenuView(cardList), RenderPosition.BEFOREEND);
//render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);
//renderFilms(siteMainElement, cardList);
//render(siteFooterElement, new FooterView(cardList), RenderPosition.BEFOREEND);

filterPresenter.init();
moviePresenter.init();

api
  .getCards()
  .then((cards) => {
    cardsModel.setCards(UpdateType.INIT, cards);
    render(
      siteFooterElement,
      new FooterView(cardsModel.getCards()),
      RenderPosition.BEFOREEND,
    );
  })
  .catch(() => {
    cardsModel.setCards(UpdateType.INIT, []);
  });

