import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);

export const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

export const getRandomUniqueItems = (items, count) => {
  let allItems = items.slice();
  const uniqueItems = [];
  while (uniqueItems.length < count) {
    const randomIndex = getRandomInteger(0, allItems.length - 1);
    uniqueItems.push(allItems[randomIndex]);
    allItems = allItems.slice(0, randomIndex).concat(allItems.slice((randomIndex + 1), allItems.length));
  }
  return uniqueItems;
};

export const formatDateForComment = (date) => dayjs(date).isToday()
  ? 'Today'
  : dayjs(date).fromNow();

export const checkEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

export const humanizeDate = (date) => dayjs(date).format('DD MMMM YYYY');

export const convertToHoursDuration = (date) => dayjs.duration(date, 'minutes').hours();
export const convertToMinutesDuration = (date) => dayjs.duration(date, 'minutes').minutes();

export const updateItem = (items, update) => {
  const index = items.findIndex((item) => item.id === update.id);

  if (index === -1) {
    return items;
  }

  return [
    ...items.slice(0, index),
    update,
    ...items.slice(index + 1),
  ];
};
