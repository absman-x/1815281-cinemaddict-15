import dayjs from 'dayjs';

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

const checkEscEvent = (evt) => evt.key === 'Escape' || evt.key === 'Esc';

const humanizeTaskDueDate = (dueDate) => dayjs(dueDate).format('DD MMMM YYYY');

export { getRandomInteger, getRandomUniqueItems, checkEscEvent, humanizeTaskDueDate };
