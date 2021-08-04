import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import relativeTime from 'dayjs/plugin/relativeTime';
dayjs.extend(relativeTime);
import isToday from 'dayjs/plugin/isToday';
dayjs.extend(isToday);

const getRandomInteger = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const getRandomUniqueItems = (items, count) => {
  let allItems = items.slice();
  const uniqueItems = [];
  while (uniqueItems.length < count) {
    const randomIndex = getRandomInteger(0, allItems.length - 1);
    uniqueItems.push(allItems[randomIndex]);
    allItems = allItems.slice(0, randomIndex).concat(allItems.slice((randomIndex + 1), allItems.length));
  }
  return uniqueItems;
};

const formatDateForComment = (date) => dayjs(date).isToday()
  ? 'Today'
  : dayjs(date).fromNow();

const checkEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const humanizeDate = (date) => dayjs(date).format('DD MMMM YYYY');

const convertToHoursDuration = (date) => dayjs.duration(date, 'minutes').hours();
const convertToMinutesDuration = (date) => dayjs.duration(date, 'minutes').minutes();

export { getRandomInteger, getRandomUniqueItems, checkEscEvent, humanizeDate, convertToHoursDuration, convertToMinutesDuration, formatDateForComment };
