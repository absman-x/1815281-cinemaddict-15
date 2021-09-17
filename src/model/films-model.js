import AbstractObserver from '../utils/abstract-observer.js';

export default class Cards extends AbstractObserver {
  constructor() {
    super();
    this._cards = [];
  }

  setCards(cards) {
    this._cards = cards.slice();
  }

  setComments(cards) {
    this._comments = cards.comments.slice();
  }

  getCards() {
    return this._cards;
  }

  updateCard(updateType, update) {
    const index = this._cards.findIndex((card) => card.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    this._cards = [
      ...this._cards.slice(0, index),
      update,
      ...this._cards.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addComment(updateType, update, comment) {
    update.comments = [
      comment,
      ...update.comments,
    ];

    this.updateCard(updateType, update);
  }

  deleteComment(updateType, update, comment) {
    const index = update.comments.findIndex((it) => it === comment);
    if (index === -1) {
      throw new Error('Can\'t delete unexisting comment');
    }

    update.comments = [
      ...update.comments.slice(0, index),
      ...update.comments.slice(index + 1),
    ];
    this.updateCard(updateType, update);
  }
}
