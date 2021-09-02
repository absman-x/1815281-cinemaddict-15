import dayjs from 'dayjs';

export const sortDate = (cardA, cardB) => dayjs(cardA.releaseDate).diff(dayjs(cardB.releaseDate));

export const sortRating = (element1, element2) => element2.totalRating - element1.totalRating;

export const sortComments = (element1, element2) => element2.comments.length - element1.comments.length;
