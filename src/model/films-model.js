import AbstractObserver from '../utils/abstract-observer.js';

export default class Cards extends AbstractObserver {
  constructor() {
    super();
    this._cards = [];
    this._comments = [];
  }

  setCards(updateType, cards) {
    this._cards = cards.slice();

    this._notify(updateType);
  }

  getCards() {
    return this._cards.slice();
  }

  setComments(comments) {
    this._comments = comments.slice();
  }

  getComments() {
    return this._comments;
  }

  updateCard(updateType, update) {
    const index = this._cards.findIndex((card) => parseInt(card.id, 10) === parseInt(update.id, 10));

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

  addComment(updateType, update) {
    this._notify(updateType, update);
  }

  deleteComment(updateType, update) {
    const cardIndex = this._cards.findIndex((card) => card.id === update.id);

    if (cardIndex === -1) {
      throw new Error('Can\'t update unexisting card');
    }

    const updatedCard = this._cards[cardIndex];
    const cardCommentIndex = updatedCard.comments.findIndex((comment) => parseInt(comment, 10) === update.commentId);

    if (cardCommentIndex === -1) {
      throw new Error('Can\'t update unexisting comment');
    }

    updatedCard.comments = [
      ...updatedCard.comments.slice(0, cardCommentIndex),
      ...updatedCard.comments.slice(cardCommentIndex + 1),
    ];
    this._notify(updateType, updatedCard);
  }

  static adaptToClient(card) {
    const adaptedFilm = Object.assign({}, card, {
      id: card.id,
      comments: card.comments,
      title: card['film_info'].title,
      alternativeTitle: card['film_info']['alternative_title'],
      totalRating: card['film_info']['total_rating'],
      poster: card['film_info'].poster,
      ageRating: card['film_info']['age_rating'],
      director: card['film_info'].director,
      writers: card['film_info'].writers,
      actors: card['film_info'].actors,
      releaseDate: card['film_info']['release'].date,
      releaseCountry: card['film_info']['release']['release_country'],
      runtime: card['film_info'].runtime,
      genre: card['film_info'].genre,
      description: card['film_info'].description,
      isInWatchlist: card['user_details'].watchlist,
      isAlreadyWatched: card['user_details']['already_watched'],
      watchingDate: card['user_details']['watching_date'],
      isFavorite: card['user_details'].favorite,
    });

    delete adaptedFilm['film_info'];
    delete adaptedFilm['user_details'];

    return adaptedFilm;
  }

  static adaptToServer(card) {
    const adaptedFilm = Object.assign({}, card, {
      id: card.id,
      comments: card.comments,
      'film_info': {
        title: card.title,
        'alternative_title': card.alternativeTitle,
        'total_rating': card.totalRating,
        poster: card.poster,
        'age_rating': card.ageRating,
        director: card.director,
        writers: card.writers,
        actors: card.actors,
        release: {
          date: card.releaseDate,
          'release_country': card.releaseCountry,
        },
        runtime: card.runtime,
        genre: card.genre,
        description: card.description,
      },
      'user_details': {
        watchlist: card.isInWatchlist,
        'already_watched': card.isAlreadyWatched,
        'watching_date': card.watchingDate,
        favorite: card.isFavorite,
      },
    });

    delete adaptedFilm.title;
    delete adaptedFilm.alternativeTitle;
    delete adaptedFilm.totalRating;
    delete adaptedFilm.poster;
    delete adaptedFilm.ageRating;
    delete adaptedFilm.director;
    delete adaptedFilm.writers;
    delete adaptedFilm.actors;
    delete adaptedFilm.releaseDate;
    delete adaptedFilm.releaseCountry;
    delete adaptedFilm.runtime;
    delete adaptedFilm.genre;
    delete adaptedFilm.description;
    delete adaptedFilm.isInWatchlist;
    delete adaptedFilm.isAlreadyWatched;
    delete adaptedFilm.watchingDate;
    delete adaptedFilm.isFavorite;

    return adaptedFilm;
  }
}
