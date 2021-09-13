import AbstractView from './abstract.js';

const createFilmsContainerTemplate = () => (
  `<div class="films-list__container">
      <section class="films-list">
      </section >`
);

export default class FilmsList extends AbstractView {

  getTemplate() {
    return createFilmsContainerTemplate();
  }
}
