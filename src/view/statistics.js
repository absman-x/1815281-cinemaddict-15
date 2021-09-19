import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { convertToHoursDuration, convertToMinutesDuration } from '../utils/common.js';
import {
  getProfileRating,
  getWatchedMoviesCount,
  getTotalDuration,
  getRatingGenre,
  getTopGenre,
  getMoviesFromPeriod
} from '../utils/stats.js';

const BAR_HEIGHT = 50;

const renderChart = (statisticCtx, data) => {
  const genreRating = getRatingGenre(data.movies);
  const ratingCounts = Object.values(genreRating).sort((a, b) => b - a);
  const ganreLabels = ratingCounts.map((item) => {
    const genre = Object.keys(genreRating).find(
      (key) => genreRating[key] === item,
    );
    delete genreRating[genre];
    return genre;
  });

  statisticCtx.height = BAR_HEIGHT * ratingCounts.length;

  const genreChart = new Chart(statisticCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: ganreLabels,
      datasets: [
        {
          data: ratingCounts,
          backgroundColor: '#ffe800',
          hoverBackgroundColor: '#ffe800',
          anchor: 'start',
        },
      ],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 20,
          },
          color: '#ffffff',
          anchor: 'start',
          align: 'start',
          offset: 40,
        },
      },
      scales: {
        yAxes: [
          {
            ticks: {
              fontColor: '#ffffff',
              padding: 100,
              fontSize: 20,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
            barThickness: 24,
          },
        ],
        xAxes: [
          {
            ticks: {
              display: false,
              beginAtZero: true,
            },
            gridLines: {
              display: false,
              drawBorder: false,
            },
          },
        ],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });

  return genreChart;
};

const generateStatisticTamplate = (data, movies) => {
  const profileRating = getProfileRating(movies);
  const watchedMoviesCount = getWatchedMoviesCount(data.movies);
  const totalDuration = getTotalDuration(data.movies);
  const ratingGenre = getRatingGenre(data.movies);
  const topGenre = watchedMoviesCount ? getTopGenre(ratingGenre) : '';
  getTopGenre(data.movies);

  return `<section class="statistic">
    ${profileRating
    ? `<p class="statistic__rank">
      Your rank
      <img class="statistic__img" src="images/bitmap@2x.png" alt="Avatar" width="35" height="35">
      <span class="statistic__rank-label">${profileRating}</span>
    </p>`
    : ''
}

  <form action="https://echo.htmlacademy.ru/" method="get" class="statistic__filters">
    <p class="statistic__filters-description">Show stats:</p>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-all-time" value="all-time" checked>
    <label for="statistic-all-time" class="statistic__filters-label">All time</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-today" value="today">
    <label for="statistic-today" class="statistic__filters-label">Today</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-week" value="week">
    <label for="statistic-week" class="statistic__filters-label">Week</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-month" value="month">
    <label for="statistic-month" class="statistic__filters-label">Month</label>

    <input type="radio" class="statistic__filters-input visually-hidden" name="statistic-filter" id="statistic-year" value="year">
    <label for="statistic-year" class="statistic__filters-label">Year</label>
  </form>

  <ul class="statistic__text-list">
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">You watched</h4>
      <p class="statistic__item-text">${watchedMoviesCount} <span class="statistic__item-description">movies</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Total duration</h4>
      <p class="statistic__item-text">${convertToHoursDuration(totalDuration)}
      <span class="statistic__item-description">h</span> ${convertToMinutesDuration(totalDuration)}
      <span class="statistic__item-description">m</span></p>
    </li>
    <li class="statistic__text-item">
      <h4 class="statistic__item-title">Top genre</h4>
      <p class="statistic__item-text">${topGenre}</p>
    </li>
  </ul>

  <div class="statistic__chart-wrap">
    <canvas class="statistic__chart" width="1000"></canvas>
  </div>

</section>`;
};

export default class StatisticsView extends SmartView {
  constructor(movies) {
    super();

    this._movies = movies;
    this._data = {
      period: 'all',
      movies: getMoviesFromPeriod(this._movies, 'all'),
    };

    this._periodChangeHandler = this._periodChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setCharts();
  }

  getTemplate() {
    return generateStatisticTamplate(this._data, this._movies);
  }

  removeElement() {
    super.removeElement();
  }

  restoreHandlers() {
    this._setInnerHandlers();
    this._setCharts();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector('.statistic__filters')
      .addEventListener('input', this._periodChangeHandler);
  }

  _periodChangeHandler(evt) {
    evt.preventDefault();
    const scrollPosition = scrollY;
    const periodValue = evt.target.value;
    this.updateData({
      period: periodValue,
      movies: getMoviesFromPeriod(this._movies, periodValue),
    });
    document
      .querySelector(`#statistic-${periodValue}`)
      .setAttribute('checked', 'true');
    window.scrollTo(0, scrollPosition);
  }

  _setCharts() {
    const statisticCtx = this.getElement().querySelector('.statistic__chart');
    const watchedMoviesCount = getWatchedMoviesCount(this._data.movies);

    if (watchedMoviesCount) {
      renderChart(statisticCtx, this._data);
    }
  }
}
