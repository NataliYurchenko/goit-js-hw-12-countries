import './sass/main.scss';
import countryTpl from './templates/countries.hbs';
import countriesTpl from './templates/countryNames.hbs';
var debounce = require('lodash.debounce');
import { alert, defaultModules } from '../node_modules/@pnotify/core/dist/PNotify.js';
import * as PNotifyMobile from '../node_modules/@pnotify/mobile/dist/PNotifyMobile.js';

defaultModules.set(PNotifyMobile, {});

import fetchCountries from './fetchCountries.js';

const refs = {
  searchInput: document.querySelector('.search'),
  countriesList: document.querySelector('js-countries-container'),
  countryDiv: document.querySelector('.js-country'),
};

refs.searchInput.addEventListener('input', debounce(onSearch, 1000));

function onSearch(event) {
  event.preventDefault();

  const inputValue = event.target.value;

  if (inputValue.trim() === '') {
    return alert({
      text: 'Please, type smth correct!',
    });
  }
  fetchCountries(inputValue).then(data => {
    console.log(data);
    if (data.status === 404) {
      alert({
        text: 'Error from API',
      });
    }
    console.log(data.length);
    if (data.length > 1 && data.length <= 10) {
      const names = data.map(p => p.name);
      renderCountries(names);
    }
    if (data.length === 1) {
      console.log('Only one');
      const countryProperties = data.map(p => {
        return {
          name: p.name,
          capital: p.capital,
          population: p.population,
          languages: p.languages,
          flag: p.flag,
        };
      });
      renderCountry(countryProperties[0]);
    }
    if (data.length > 10) {
      alert({
        text: 'Too many items!',
      });
    }
  });
}

function renderCountry(countryProperties) {
  refs.countryDiv.innerHTML = countryTpl(countryProperties);
}

function renderCountries(names) {
  console.log(names);
  refs.countryDiv.innerHTML = countriesTpl({ names });
}
