import countries from './countries.json';

const API_KEY = 'PGVpj5B2ke0spXMDy1QJDYveXLa7zjEE';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

const eventsContainer = document.querySelector('.main-events-container');
const searchInput = document.getElementById('heroInputSearch');

const countriesBtn = document.getElementById('heroBtnCountry');
const countriesBlock = document.querySelector('.countries-block');

let allEvents = [];

function handleBtnClick() {
  countriesBlock.classList.toogle('is-open');
  if (!countriesBlock.classList.contains('is-open')) return;
  countries.forEach(country => {
    const countryItem = document.createElement('div');
    countryItem.textContent = country.name;
    countryItem.classList.add('country-item');

    countryItem.addEventListener('click', () => {
      countriesBtn.value = country.name;
      // Додати код країни
      countriesBlock.classList.remove('is-open');
    });
    countriesBlock.appendChild(countryItem);
  });
}

countriesBtn.addEventListener('click', handleBtnClick);

async function getEvents() {
  try {
    const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&size=20`);
    if (!response.ok) {
      throw new Error(`HTTP error ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}

function getEventImage(event) {
  const img =
    event.images.find(img => img.ratio === '4_3') ||
    event.images.find(img => img.ratio === '3_2') ||
    event.images[0];

  return img.url;
}

function renderEvents(events = []) {
  if (!events.length) {
    eventsContainer.innerHTML =
      '<li class="event-element">No events found</li>';
    return;
  }

  const markup = events
    .map(
      event =>
        `<li class="event-element"><img src="${getEventImage(event)}" width="200px" class="event-image"><p class="event-name">${event.name}<div class="event-text-container"></p><p class="event-time">${event.dates.start.localDate}</p><p class="event-area">${event._embedded.venues[0].name}</p></div></li>`
    )
    .join('');

  eventsContainer.innerHTML = markup;
}

function filterAndRender(query) {
  if (!query) {
    renderEvents(allEvents);
    return;
  }
  const q = query.trim().toLowerCase();
  const filtered = allEvents.filter(ev => {
    const name = (ev.name || '').toLowerCase();
    const date = (
      ev.dates && ev.dates.start && ev.dates.start.localDate
        ? ev.dates.start.localDate
        : ''
    ).toLowerCase();
    return name.includes(q) || date.includes(q);
  });
  renderEvents(filtered);
}

async function startApp() {
  const data = await getEvents();
  const events =
    data && data._embedded && data._embedded.events
      ? data._embedded.events
      : [];
  allEvents = events;
  console.log(allEvents);
  renderEvents(allEvents);
  getEventImage(events);
}

if (searchInput) {
  searchInput.addEventListener('input', e => {
    filterAndRender(e.target.value);
  });
}

startApp();
