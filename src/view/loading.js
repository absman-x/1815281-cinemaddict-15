import AbstractView from './abstract.js';

const generateLoadingTamplate = () =>
  '<h2 class="films-list__title">Loading...</h2>';

export default class LoadingView extends AbstractView {
  constructor() {
    super();
  }

  getTemplate() {
    return generateLoadingTamplate();
  }
}
