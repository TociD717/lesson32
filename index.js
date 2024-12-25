const filmsOutput = document.querySelector('.filmsList');
const searchForm = document.querySelector('.search-input');
const addToSearchCheckbox = document.querySelector('.checkbox-input');

let lastSearchQuery = null;
let isSearchTriggerEnabled = false;

const searchCountdown = (() => {
  let timer = null;
  return (callback, time) => {
    if (timer) {
      clearTimeout(timer);
      timer = null;
    }
    timer = setTimeout(callback, time);
  };
})();

function getData(url) {
  return fetch(url)
    .then((res) => res.json())
    .then((data) => {
      if (!data || !data.Search) throw 'Server request went wrong';
      return data.Search;
    });
}

const clearMoviesList = () => {
  if (filmsOutput) filmsOutput.innerHTML = '';
};

function searchHandler(e) {
  searchCountdown(() => {
    const searchQuery = e.target.value.trim();
    if (!searchQuery || searchQuery.length < 4 || searchQuery === lastSearchQuery) return;
    if (!isSearchTriggerEnabled) clearMoviesList();

    let url = `http://www.omdbapi.com/?apikey=a1f5b2ba&s=${searchQuery}`;
    getData(url)
      .then((films) => films.forEach((film) => showFilms(film)))
      .catch((err) => console.error(err));

    lastSearchQuery = searchQuery;
  }, 2000);
}

function showFilms({ Poster: poster, Title: title, Year: year }) {
  const filmItem = document.createElement('div');
  const filmImage = document.createElement('img');
  filmItem.classList.add('film');
  filmImage.classList.add('film-poster');
  filmImage.src = /^(https?:\/\/)/i.test(poster) ? poster : 'assets/no-image.png';
  filmImage.alt = `${title} ${year}`;
  filmImage.title = `${title} ${year}`;

  filmItem.append(filmImage);
  filmsOutput.prepend(filmItem);
}

searchForm.addEventListener('input', searchHandler);
addToSearchCheckbox.addEventListener('change', (e) => (isSearchTriggerEnabled = e.target.checked));
