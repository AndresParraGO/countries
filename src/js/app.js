import '../css/styles.css';
import 'ol/ol.css';
import 'animate.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat } from 'ol/proj';

const API_URL = 'https://restcountries.eu/rest/v2';
const $containerCountries = document.getElementById('container-countries');
const $searchInput = document.getElementById('search-input');
const $filterCountry = document.getElementById('filter-country');
const $btnDarkMode = document.getElementById('btn__dark--mode');


const renderModalCountry = (country) => {
  const modal = document.createElement('div');
  const iconCloseModal = document.createElement('span');
  modal.id = 'modal';
  modal.className = 'modal animate__animated animate__backInUp';
  iconCloseModal.className = 'modal-icon-close';
  iconCloseModal.textContent = 'x';
  iconCloseModal.addEventListener('click', e => removeModalCountry());

  modal.innerHTML = `
    <section class="modal-container">
      <h3>${country.name}</h3>
      <span class="modal-capital">${country.capital}</span>
      <p class="modal-population"><strong>Population:</strong> ${country.population}</p>

      <h4>Currencies</h4>
      <ul class="modal-currencies">
        ${country.currencies.map(el => `<li class="modal-currency-item">${el.code} <strong>${el.symbol}</strong></li>`)}
      </ul>

      <h4>Languages</h4>
      <ul class="modal-languages">
        ${country.languages.map(el => `<li class="modal-language-item">${el.name}</li>`)}
      </ul>

      <h4>Borders</h4>
      <ul class="modal-borders">
        ${country.borders.length > 0 ? country.borders.map(el => `<li class="modal-borders-item">${el}</li>`) : '<span>Not borders</<span>'}
      </ul>

      <div id="map"></div>
    </section>
  `;
  modal.children[0].appendChild(iconCloseModal);
  document.body.appendChild(modal);

  // render map
  renderMap(country.latlng[0], country.latlng[1]);
}

const removeModalCountry = () => {
  document.querySelector('#modal').remove();
}


const renderCountries = (countries) => {
  if(Array.isArray(countries) === true) {
    $containerCountries.innerHTML = '';
    const fragment = new DocumentFragment();

    countries.forEach((country, i) => {
      // console.log(country)
      const div = document.createElement('article');
      div.className = 'country animate__animated animate__zoomIn';
      div.addEventListener('click', e => renderModalCountry(country));
      div.innerHTML = `
        <img src=${country.flag} alt=${country.name} class="country__img">
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


const darkMode = () => {
  document.body.classList.toggle('dark-mode')
}



const getAllCountries = async (country, region) => {
  const fetchURL = country ? country ? `/name/${country}` : '/all' : region ? `/region/${region}` : '/all'
  const res = await fetch(`${API_URL}${fetchURL}`);
  const countriesData = await res.json();
  renderCountries(countriesData);
}


// Map

function renderMap(lat, lon) {
  const map = new Map({
    target: 'map',
    layers: [
      new TileLayer({
        source: new OSM()
      })
    ],
    view: new View({
      center: fromLonLat([lon, lat]),
      zoom: 4
    })
  });
}


$searchInput.addEventListener('keyup', e => {
  getAllCountries($searchInput.value);
});

$filterCountry.addEventListener('change', e => {
  getAllCountries('', e.target.value);
});

// Event Dark Mode
$btnDarkMode.addEventListener('click', e => {
  darkMode();
});

document.addEventListener('DOMContentLoaded', (e) => {
  getAllCountries();
});

