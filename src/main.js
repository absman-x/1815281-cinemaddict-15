import FooterView from './view/footer.js';
import StatisticsView from './view/statistics.js';
import { render, RenderPosition, remove } from './utils/render.js';
import CardsModel from './model/films-model.js';
import FilterModel from './model/filter-model.js';
import MoviePresenter from './presenter/movie-board-presenter.js';
import FilterPresenter from './presenter/filter-presenter.js';
import Api from './api/api.js';
import { MenuItem, UpdateType } from './const.js';

const AUTHORIZATION = 'Basic 298aer48zzs9r';
const END_POINT = 'https://15.ecmascript.pages.academy/cinemaddict/';

const api = new Api(END_POINT, AUTHORIZATION);

const cardsModel = new CardsModel();
const filterModel = new FilterModel();

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer__statistics');

let statisticsComponent = null;
let currentMenuItem = MenuItem.MOVIES;


const moviePresenter = new MoviePresenter(siteMainElement, siteHeaderElement, cardsModel, filterModel, api);
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

