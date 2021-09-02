import dayjs from 'dayjs';

export const isCardExpired = (dueDate) =>
  dueDate === null ? false : dayjs().isAfter(dueDate, 'D');

export const isCardExpiringToday = (dueDate) =>
  dueDate === null ? false : dayjs(dueDate).isSame(dayjs(), 'D');

export const isCardRepeating = (repeating) => Object.values(repeating).some(Boolean);

export const formatCardDueDate = (dueDate) => {
  if (!dueDate) {
    return '';
  }

  return dayjs(dueDate).format('D MMMM');
};

export const sortDate = (cardA, cardB) => dayjs(cardA.filmInfo.release.date).diff(dayjs(cardB.filmInfo.release.date));

export const sortRating = (element1, element2) => element2.filmInfo.totalRating - element1.filmInfo.totalRating;

export const sortComments = (element1, element2) => element2.comments.length - element1.comments.length;
