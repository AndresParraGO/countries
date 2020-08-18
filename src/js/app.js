

import '../css/styles.css';


const API_URL = 'https://restcountries.eu/rest/v2';
const $containerCountries = document.getElementById('container-countries');
const $searchInput = document.getElementById('search-input');
const $filterCountry = document.getElementById('filter-country');


const renderCountries = (countries) => {
  if(Array.isArray(countries) === true) {
    $containerCountries.innerHTML = '';
    const fragment = new DocumentFragment();

    countries.forEach((country, i) => {
      const div = document.createElement('article');
      div.className = 'country';
      div.innerHTML = `
        <img src=${country.flag} alt="" class="country__img">
        <div class="country__content">
          <h3 class="country__title">${country.name}</h3>

          <p><span class="country__category">Population:</span> ${country.population}</p>
          <p><span class="country__category">Region:</span> ${country.region}</p>
          <p><span class="country__category">Capital:</span> ${country.capital}</p>
        </div>
      `;
      fragment.appendChild(div);
    });

    $containerCountries.appendChild(fragment);
  } else {
    if(countries.status === 404) {
      $containerCountries.innerHTML = '<p>No existe</p>'
    }
  }
}



const getAllCountries = async (country, region) => {
  const fetchURL = country ? country ? `/name/${country}` : '/all' : region ? `/region/${region}` : '/all'
  const res = await fetch(`${API_URL}${fetchURL}`);
  const countriesData = await res.json();
  renderCountries(countriesData);
}



$searchInput.addEventListener('keyup', e => {
  getAllCountries($searchInput.value);
});


$filterCountry.addEventListener('change', e => {
  getAllCountries('', e.target.value)
});


document.addEventListener('DOMContentLoaded', (e) => {
  getAllCountries();
});
