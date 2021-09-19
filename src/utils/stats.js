import dayjs from 'dayjs';

const getProfileRating = (films) => {
  const alreadyWatchedFilms = films.filter((item) => item.isAlreadyWatched);
  const alreadyWatchedFilmsCount = alreadyWatchedFilms.length;

  let profileRating = null;

  if (alreadyWatchedFilmsCount) {
    switch (true) {
      case alreadyWatchedFilmsCount >= 1 && alreadyWatchedFilmsCount <= 10:
        profileRating = 'Novice';
        break;
      case alreadyWatchedFilmsCount >= 11 && alreadyWatchedFilmsCount <= 20:
        profileRating = 'Fan';
        break;
      case alreadyWatchedFilmsCount >= 21:
        profileRating = 'Movie Buff';
        break;
    }
  }
  return profileRating;
};

const getWatchedMoviesCount = (movies) => {
  let watchedMoviesCount = 0;

  movies.forEach((movie) => {
    if (movie.isAlreadyWatched) {
      watchedMoviesCount++;
    }
  });

  return watchedMoviesCount;
};

const getTotalDuration = (movies) => {
  let totalDuration = 0;

  movies.forEach((movie) => {
    if (movie.isAlreadyWatched) {
      totalDuration += movie.runtime;
    }
  });

  return totalDuration;
};

const getRatingGenre = (movies) => {
  const genreRating = {};
  movies.forEach((movie) => {
    movie.genre.forEach((genre) => {
      if (genreRating[genre] === undefined) {
        genreRating[genre] = 1;
      } else {
        genreRating[genre]++;
      }
    });
  });

  return genreRating;
};

const getTopGenre = (genreRating) => {
  const topRating = Object.values(genreRating).sort((a, b) => b - a)[0];
  const topGenre = Object.keys(genreRating).find(
    (key) => genreRating[key] === topRating,
  );
  return topGenre;
};

const getMoviesFromPeriod = (movies, period) => {
  let beginPeriodDate = null;
  switch (period) {
    case 'all':
      beginPeriodDate = null;
      break;
    case 'today':
      beginPeriodDate = dayjs();
      break;
    case 'week':
      beginPeriodDate = dayjs().subtract(7, 'day');
      break;
    case 'month':
      beginPeriodDate = dayjs().subtract(1, 'month');
      break;
    case 'year':
      beginPeriodDate = dayjs().subtract(1, 'year');
      break;
    default:
      beginPeriodDate = null;
      break;
  }

  if (!beginPeriodDate) {
    return movies;
  }

  const filteredMovies = movies.filter((movie) => {
    if (period === 'today') {
      return (
        beginPeriodDate.format('DD/MM/YYYY') ===
        dayjs(movie.watchingDate).format('DD/MM/YYYY')
      );
    } else {
      return beginPeriodDate.isBefore(dayjs(movie.watchingDate));
    }
  });

  return filteredMovies;
};

export {
  getProfileRating,
  getWatchedMoviesCount,
  getTotalDuration,
  getRatingGenre,
  getTopGenre,
  getMoviesFromPeriod
};
