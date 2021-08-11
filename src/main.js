import UserRankView from './view/rank.js';
import MenuView from './view/menu.js';
import FilmsView from './view/films.js';
import FilmsListView from './view/films-list.js';
import NoFilmsView from './view/no-films.js';
import ExtraView from './view/films-extra.js';
import CardView from './view/card.js';
import ShowMoreButtonView from './view/show-more-button.js';
import PopupView from './view/popup.js';
import FooterView from './view/footer.js';
import { render, RenderPosition, checkEscEvent } from './utils.js';
import { generateCard } from './mock/card-mock.js';
import { generateComment } from './mock/comment-mock.js';

const MAIN_MOVIE_COUNT = 23;
const EXTRA_MOVIE_COUNT = 2;
const MOVIE_COUNT_PER_STEP = 5;

const cardList = new Array(MAIN_MOVIE_COUNT).fill().map(generateCard);
const mostCommentedCards = cardList.slice().sort((element1, element2) => element2.comments.length - element1.comments.length).splice(0, EXTRA_MOVIE_COUNT);
const topRatedCards = cardList.slice().sort((element1, element2) => element2.filmInfo.totalRating - element1.filmInfo.totalRating).splice(0, EXTRA_MOVIE_COUNT);

const siteMainElement = document.querySelector('.main');
const siteHeaderElement = document.querySelector('.header');
const siteFooterElement = document.querySelector('.footer__statistics');
const siteBodyElement = document.body;

let openedPopup = undefined;

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

  openedPopup.querySelector('.film-details__close-btn').addEventListener('click', () => {
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

  cardComponent.getElement().querySelector('.film-card__poster').addEventListener('click', () => {
    showPopup(card, popupComments);
    document.addEventListener('keydown', onEscKeyDown);
  });

  cardComponent.getElement().querySelector('.film-card__title').addEventListener('click', () => {
    showPopup(card, popupComments);
    document.addEventListener('keydown', onEscKeyDown);
  });

  cardComponent.getElement().querySelector('.film-card__comments').addEventListener('click', () => {
    showPopup(card, popupComments);
    document.addEventListener('keydown', onEscKeyDown);
  });

  render(filmsListComponent, cardComponent.getElement(), RenderPosition.BEFOREEND);
};

const renderFilms = (filmsContainer, filmsCards) => {
  const filmsComponent = new FilmsView();
  const filmsPlugComponent = new NoFilmsView();
  const filmsListComponent = new FilmsListView();

  render(filmsContainer, filmsComponent.getElement(), RenderPosition.BEFOREEND);

  if (filmsCards.length === 0) {
    render(filmsComponent.getElement(), new NoFilmsView('All movies').getElement(), RenderPosition.AFTERBEGIN);
    return;
  }

  render(filmsComponent.getElement(), filmsPlugComponent.getElement(), RenderPosition.AFTERBEGIN);
  render(filmsPlugComponent.getElement(), filmsListComponent.getElement(), RenderPosition.BEFOREEND);

  cardList
    .slice(0, Math.min(cardList.length, MOVIE_COUNT_PER_STEP))
    .forEach((card) => renderCard(filmsListComponent.getElement(), card));

  if (cardList.length > MOVIE_COUNT_PER_STEP) {
    let renderedMovieCount = MOVIE_COUNT_PER_STEP;

    const showMoreButtonComponent = new ShowMoreButtonView();
    render(filmsPlugComponent.getElement(), showMoreButtonComponent.getElement(), RenderPosition.BEFOREEND);

    showMoreButtonComponent.getElement().addEventListener('click', (evt) => {
      evt.preventDefault();
      cardList
        .slice(renderedMovieCount, renderedMovieCount + MOVIE_COUNT_PER_STEP)
        .forEach((card) => renderCard(filmsListComponent.getElement(), card));

      renderedMovieCount += MOVIE_COUNT_PER_STEP;

      if (renderedMovieCount >= cardList.length) {
        showMoreButtonComponent.getElement().remove();
      }
    });
  }
  const siteFilmsTopRatedElement = new ExtraView('Top rated');
  const siteFilmsMostCommentedElement = new ExtraView('Most commented');
  render(filmsComponent.getElement(), siteFilmsTopRatedElement.getElement(), RenderPosition.BEFOREEND);
  render(filmsComponent.getElement(), siteFilmsMostCommentedElement.getElement(), RenderPosition.BEFOREEND);

  const filmsTopRatedListComponent = new FilmsListView();
  render(siteFilmsTopRatedElement.getElement(), filmsTopRatedListComponent.getElement(), RenderPosition.BEFOREEND);
  topRatedCards.forEach((card) => renderCard(filmsTopRatedListComponent.getElement(), card));

  const filmsMostCommentedListComponent = new FilmsListView();
  render(siteFilmsMostCommentedElement.getElement(), filmsMostCommentedListComponent.getElement(), RenderPosition.BEFOREEND);
  mostCommentedCards.forEach((card) => renderCard(filmsMostCommentedListComponent.getElement(), card));
};

render(siteHeaderElement, new UserRankView().getElement(), RenderPosition.BEFOREEND);
render(siteMainElement, new MenuView(cardList).getElement(), RenderPosition.BEFOREEND);
renderFilms(siteMainElement, cardList);
render(siteFooterElement, new FooterView(cardList).getElement(), RenderPosition.BEFOREEND);
