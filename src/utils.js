import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);

export const RenderPosition = {
  AFTERBEGIN: 'afterbegin',
  BEFOREEND: 'beforeend',
};

export const render = (container, element, place) => {
  switch (place) {
    case RenderPosition.AFTERBEGIN:
      container.prepend(element);
      break;
    case RenderPosition.BEFOREEND:
      container.append(element);
      break;
  }
};

export const createElement = (template) => {
  const newElement = document.createElement('div');
  newElement.innerHTML = template;

  return newElement.firstChild;
};

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
