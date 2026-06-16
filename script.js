'use strict';
const API_KEY = 'rc_live_8c4a61c58b414b3ca82f8a8a21afb493';

const btn = document.querySelector('.btn-country');
const countriesContainer = document.querySelector('.countries');
const input = document.querySelector('.input-country');

const renderCountry = function (data, _languages, _currencies, className = '') {
  const languages = Object.values(data.languages);
  const currencies = Object.values(data.currencies);

  const html = `
  <article class="country ${className}">
      <img class="country__img" src="${data.flags.png}" />
      <div class="country__data">
          <h3 class="country__name">${data.name.common}</h3>
          <h4 class="country__region">${data.region}</h4>
          <p class="country__row"><span>👫</span>${(+data.population / 1000000).toFixed(
            2,
          )} mln people</p>
          <p class="country__row"><span>🗺</span>${data.area.toLocaleString()} km&sup2;</p>
           <p class="country__row"><span>🗣️</span>${languages}</p>
           <p class="country__row"><span>💰</span>${currencies[0].name}</p>
      </div>
  </article>
`;
  countriesContainer.insertAdjacentHTML('beforeend', html);
  // countriesContainer.style.opacity = 1;
};

const renderError = function (message) {
  countriesContainer.insertAdjacentText('beforeend', message);
  // countriesContainer.style.opacity = 1;
};

const getJSON = function (url, errorMessage = 'Something went wrong') {
  return fetch(url, {
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
  }).then((response) => {
    if (!response.ok) throw new Error(`${errorMessage} (${response.status})`);
    return response.json();
  });

const getCountryAndNeighbours = function (country) {
  getJSON(`https://api.restcountries.com/countries/v5?q=${country}`, 'Country not found')
    .then((data) => {
      console.log(data);
      renderCountry(data[0]);

      //   const neighbour = data[0].borders?.[0];

      //   return fetch(`https://restcountries.com/v3.1/alpha/${neighbour}`);
      // })
      // .then((response) => response.json())
      // .then((data) => {
      //   renderCountry(data[0], 'neighbour');
      // });
      ////////

      const neighbour = data[0].borders;
      if (!neighbour || neighbour.length === 0) {
      throw new Error('No neighbour found');
      }
      return getJSON(
  `https://api.restcountries.com/countries/v5?codes=${neighbour.join(',')}`,
  'Country not found',
  )
    .then((resData) => {
      resData.forEach((data) => {
        const languages = Object.values(data.languages);
        const currencies = Object.values(data.currencies);
        renderCountry(data, languages, currencies, 'neighbour');
      });
    })
    .catch((err) => {
      console.error(err);
      renderError(`Something went wrong: ${err.message}. Try again!`);
    })
    .finally(() => (countriesContainer.style.opacity = 1));
};

btn.addEventListener('click', function () {
  const countryName = input.value.toLowerCase();

  if (countryName.trim() === '') {
    renderError('Please enter a country name');
    return;
  }
  countriesContainer.innerHTML = '';
  getCountryAndNeighbours(countryName);
  input.value = '';
});
