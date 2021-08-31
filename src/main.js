import UserRankView from './view/rank.js';
/*import MenuView from './view/menu.js';
import SortView from './view/sort.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
import NoFilmsView from './view/no-films.js';
import ExtraView from './view/films-extra.js';
import CardView from './view/card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import PopupView from './view/popup.js';*/
import FooterView from './view/footer.js';
import { render, RenderPosition, remove } from './utils/render.js';
//import { checkEscEvent } from './utils/common.js';
import { generateCard } from './mock/card-mock.js';
//import { generateComment } from './mock/comment-mock.js';
import MoviePresenter from './presenter/films-board.js';

const MAIN_MOVIE_COUNT = 12;
const EXTRA_MOVIE_COUNT = 2;
//const MOVIE_COUNT_PER_STEP = 5;

const cardList = new Array(MAIN_MOVIE_COUNT).fill().map(generateCard);
const mostCommentedCards = cardList.slice().sort((element1, element2) => element2.comments.length - element1.comments.length).splice(0, EXTRA_MOVIE_COUNT);
const topRatedCards = cardList.slice().sort((element1, element2) => element2.filmInfo.totalRating - element1.filmInfo.totalRating).splice(0, EXTRA_MOVIE_COUNT);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer__statistics');
const siteBodyElement = document.body;

/*let openedPopup = undefined;

const closePopup = () => {
  document.removeEventListener('keydown', onEscKeyDown);
  siteBodyElement.removeChild(openedPopup);
  siteBodyElement.classList.remove('hide-overflow');
  openedPopup = undefined;
};

const showPopup = (card, popupComments) => {
  const popupComponent = new PopupView(card, popupComments);

  if (openedPopup !== undefined) {
    closePopup();
  }
  openedPopup = popupComponent.getElement();
  siteBodyElement.appendChild(openedPopup);
  siteBodyElement.classList.add('hide-overflow');

  popupComponent.setClosePopupHandler(() => {
    closePopup();
  });
};

function onEscKeyDown(evt) {
  if (checkEscEvent(evt)) {
    evt.preventDefault();
    closePopup();
  }
}

const renderCard = (filmsListComponent, card) => {
  const cardComponent = new CardView(card);
  const popupComments = (card.comments).map((id) => generateComment(id));

  cardComponent.setOpenPopupHandler(() => {
    showPopup(card, popupComments);
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(filmsListComponent, cardComponent, RenderPosition.BEFOREEND);
};

const renderFilms = (filmsContainer, filmsCards) => {
  const filmsComponent = new FilmsView();
  const filmsPlugComponent = new NoFilmsView();
  const filmsListComponent = new FilmsListView();

  render(filmsContainer, filmsComponent, RenderPosition.BEFOREEND);

  if (filmsCards.length === 0) {
    render(filmsComponent, new NoFilmsView('All movies'), RenderPosition.AFTERBEGIN);
    return;
  }

  render(filmsComponent, filmsPlugComponent, RenderPosition.AFTERBEGIN);
  render(filmsPlugComponent, filmsListComponent, RenderPosition.BEFOREEND);

  cardList
    .slice(0, Math.min(cardList.length, MOVIE_COUNT_PER_STEP))
    .forEach((card) => renderCard(filmsListComponent, card));

  if (cardList.length > MOVIE_COUNT_PER_STEP) {
    let renderedMovieCount = MOVIE_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();
    render(filmsPlugComponent, showMoreButtonComponent, RenderPosition.BEFOREEND);

    showMoreButtonComponent.setClickHandler(() => {
      cardList
        .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
        .forEach((card) => renderCard(filmsListComponent, card));

      renderedMovieCount += MOVIE_COUNT_PER_STEP;

      if (renderedMovieCount >= cardList.length) {
        remove(showMoreButtonComponent);
      }
    });
  }
  const siteFilmsTopRatedElement = new ExtraView('Top rated');
  const siteFilmsMostCommentedElement = new ExtraView('Most commented');
  render(filmsComponent, siteFilmsTopRatedElement, RenderPosition.BEFOREEND);
  render(filmsComponent, siteFilmsMostCommentedElement, RenderPosition.BEFOREEND);

  const filmsTopRatedListComponent = new FilmsListView();
  render(siteFilmsTopRatedElement, filmsTopRatedListComponent, RenderPosition.BEFOREEND);
  topRatedCards.forEach((card) => renderCard(filmsTopRatedListComponent, card));

  const filmsMostCommentedListComponent = new FilmsListView();
  render(siteFilmsMostCommentedElement, filmsMostCommentedListComponent, RenderPosition.BEFOREEND);
  mostCommentedCards.forEach((card) => renderCard(filmsMostCommentedListComponent, card));
}; */
const moviePresenter = new MoviePresenter(siteMainElement);

render(siteHeaderElement, new UserRankView(), RenderPosition.BEFOREEND);
//render(siteMainElement, new MenuView(cardList), RenderPosition.BEFOREEND);
//render(siteMainElement, new SortView(), RenderPosition.BEFOREEND);
//renderFilms(siteMainElement, cardList);
render(siteFooterElement, new FooterView(cardList), RenderPosition.BEFOREEND);

moviePresenter.init(cardList);
