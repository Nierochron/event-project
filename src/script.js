import countryList from './countries.json';

const countriesBtn = document.getElementById('heroBtnCountry');
const countriesBlock = document.querySelector('.countries-block');
const countriesListMenu = document.querySelector('.countries-list-menu');
const countryButton = document.getElementById('heroBtnCountry');

function renderCountriesList() {
  countriesListMenu.innerHTML = '';

  countryList.forEach(country => {
    const li = document.createElement('li');
    li.textContent = country.name;
    li.className = 'country-item';

    li.addEventListener('click', () => {
      countryButton.textContent = country.name;
      countriesBlock.classList.remove('is-active');
      countriesBtn.classList.remove('focus');
    });

    countriesListMenu.appendChild(li);
  });
}

renderCountriesList();

function updateCountriesBlockWidth() {
  const width = countriesBtn.offsetWidth;
  countriesBlock.style.width = width + 'px';
}

countriesBtn.addEventListener('click', () => {
  const isActive = countriesBlock.classList.toggle('is-active');
  countriesBtn.classList.toggle('focus', isActive);

  if (isActive) updateCountriesBlockWidth();
});

window.addEventListener('resize', () => {
  if (countriesBlock.classList.contains('is-active')) {
    updateCountriesBlockWidth();
  }
});
