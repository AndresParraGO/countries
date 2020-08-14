


const API_URL = 'https://restcountries.eu/rest/v2';
const $containerCountries = document.getElementById('container-countries');



const renderCountries = (countries) => {
  const fragment = new DocumentFragment();

  countries.forEach((country, i) => {
    if(i<20) {
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
    }
  })

  $containerCountries.appendChild(fragment);
}



const getAllCountries = async () => {
  const res = await fetch(`${API_URL}/all`);
  const countriesData = await res.json();
  renderCountries(countriesData);
}



document.addEventListener('DOMContentLoaded', (e) => {
  getAllCountries()
})
