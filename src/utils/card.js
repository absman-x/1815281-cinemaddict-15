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

// Функция помещает задачи без даты в конце списка,
// возвращая нужный вес для колбэка sort
const getWeightForNullDate = (dateA, dateB) => {
  if (dateA === null && dateB === null) {
    return 0;
  }

  if (dateA === null) {
    return 1;
  }

  if (dateB === null) {
    return -1;
  }

  return null;
};

export const sortCardUp = (cardA, cardB) => {
  const weight = getWeightForNullDate(cardA.filmInfo.release.date, cardB.filmInfo.release.date);

  if (weight !== null) {
    return weight;
  }

  return dayjs(cardA.filmInfo.release.date).diff(dayjs(cardB.filmInfo.release.date));
};

export const sortCardDown = (cardA, cardB) => {
  const weight = getWeightForNullDate(cardA.dueDate, cardB.dueDate);

  if (weight !== null) {
    return weight;
  }

  return dayjs(cardB.dueDate).diff(dayjs(cardA.dueDate));
};

export const sortDate = (cardA, cardB) => dayjs(cardA.filmInfo.release.date).diff(dayjs(cardB.filmInfo.release.date));

export const sortRating = (element1, element2) => element2.filmInfo.totalRating - element1.filmInfo.totalRating;
