
import dayjs from 'dayjs';
import { DESCRIPTIONS, FILM_TITLES, POSTERS, WRITERS, ACTORS, DIRECTORS, GENRE, RELEASE_COUNTRY } from './const_mock.js';
import { getRandomInteger, getRandomUniqueItems } from '../utils.js';

const MIN_DESCRIPTIONS_COUNT = 1;
const MAX_DESCRIPTIONS_COUNT = 5;
const MAX_COMMENTS_COUNT = 15;

const generateDescription = () => {
  const descriptionsCount = getRandomInteger(MIN_DESCRIPTIONS_COUNT, MAX_DESCRIPTIONS_COUNT);

  return getRandomUniqueItems(DESCRIPTIONS, descriptionsCount).join(' ');
};

const generateSingleData = (data) => {
  const randomIndex = getRandomInteger(0, data.length - 1);

  return data[randomIndex];
};

const generateMultiData = (data) => {
  const dataCount = getRandomInteger(MIN_DESCRIPTIONS_COUNT, MAX_DESCRIPTIONS_COUNT);

  return getRandomUniqueItems(data, dataCount);
};

const generateAlternativeTitle = (title) => title.split('').reverse().join('');

const generateBoolean = () => Boolean(getRandomInteger(0, 1));

const generateDate = (maxDaysGap) => {
  const daysGap = getRandomInteger(-maxDaysGap, 0);
  const newDate = dayjs().add(daysGap, 'day').toDate();
  return dayjs(newDate).format();
};

const commentNumber = () => getRandomInteger(1, 50);

const generateReleaseDate = () => (generateDate(10000));

export const generateCard = () => {
  const commentsList = new Array(getRandomInteger(1, MAX_COMMENTS_COUNT)).fill().map(commentNumber);
  const filmTitle = generateSingleData(FILM_TITLES);
  const releaseData = {
    date: generateReleaseDate(),
    releaseCountry: generateSingleData(RELEASE_COUNTRY),
  };
  const filmInfo = {
    title: filmTitle,
    alternativeTitle: generateAlternativeTitle(filmTitle),
    totalRating: getRandomInteger(0, 100),
    poster: generateSingleData(POSTERS),
    ageRating: getRandomInteger(0, 100),
    director: generateSingleData(DIRECTORS),
    writers: generateMultiData(WRITERS),
    actors: generateMultiData(ACTORS),
    description: generateDescription(),
    release: releaseData,
    runtime: getRandomInteger(90, 190),
    genre: generateMultiData(GENRE),
  };
  const userDetails = {
    watchlist: generateBoolean(),
    alreadyWatched: generateBoolean(),
    watchingDate: generateDate(7),
    favorite: generateBoolean(),
  };

  return {
    id: getRandomInteger(0, 100),
    filmInfo,
    userDetails,
    comments: commentsList,
  };
};
