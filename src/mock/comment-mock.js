
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
dayjs.extend(duration);
import { EMOTIONS, AUTHOR_NAME, AUTHOR_SURNAME, COMMENT_TEXT } from './const_mock.js';
import { getRandomInteger } from '../utils.js';

const generateSingleData = (data) => {
  const randomIndex = getRandomInteger(0, data.length - 1);

  return data[randomIndex];
};

const generateDate = () => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, 0);

  return dayjs().add(daysGap, 'day').format();
};

export const generateComment = () => {
  const AUTHOR = `${generateSingleData(AUTHOR_NAME)} ${generateSingleData(AUTHOR_SURNAME)}`;

  return {
    id: getRandomInteger(1, 150),
    author: AUTHOR,
    emotion: generateSingleData(EMOTIONS),
    comment: generateSingleData(COMMENT_TEXT),
    date: generateDate(),
  };
};
