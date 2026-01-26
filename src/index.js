let countries = [];

async function loadCountries() {
  const res = await fetch('./countries.json');
  countries = await res.json();
}

const API_KEY = 'PGVpj5B2ke0spXMDy1QJDYveXLa7zjEE';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

const eventsContainer = document.querySelector('.main-events-container');
const paginationContainer = document.querySelector('.pagination-container');
const searchInput = document.getElementById('heroInputSearch');

const countriesBtn = document.getElementById('heroBtnCountry');
const countriesBlock = document.querySelector('.countries-block');

const modalBackdrop = document.querySelector('.modal-backdrop');
const closeBtn = document.querySelector('.btn-modal-close');

let allEvents = [];
let page = 1;
const size = 20;
let query = '';

// function handleBtnClick() {
//   countriesBlock.classList.toggle('is-open');
//   if (!countriesBlock.classList.contains('is-open')) return;

//   countriesBlock.innerHTML = '';

//   countries.forEach(country => {
//     const countryItem = document.createElement('div');
//     countryItem.textContent = country.name;
//     countryItem.classList.add('country-item');

//     countryItem.addEventListener('click', () => {
//       countriesBtn.textContent = country.name;
//       countriesBlock.classList.remove('is-open');
//     });

//     countriesBlock.appendChild(countryItem);
//   });
// }

// countriesBtn.addEventListener('click', handleBtnClick);

async function getEvents() {
  let url = `${BASE_URL}?apikey=${API_KEY}&size=${size}&page=${page - 1}`;

  if (query) {
    url += `&keyword=${query}`;
  }

  const response = await fetch(url);
  const data = await response.json();
  return data;
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
        `<li class="event-element" data-id="${event.id}">
          <div class="event-card-background"></div>
          <img src="${getEventImage(event)}" width="280px" class="event-image">
          <div class="event-text-container">
          <p class="event-name">${event.name}</p>
            <p class="event-time">${event.dates.start.localDate}</p>
            <p class="event-area">${event._embedded.venues[0].name}</p>
          </div>
        </li>`
    )
    .join('');

  eventsContainer.innerHTML = markup;
}

function renderPagination(totalPages) {
  paginationContainer.innerHTML = '';

  const prevBtn = document.createElement('button');
  prevBtn.textContent = 'Prev';
  prevBtn.className = 'pagination-btn';
  prevBtn.disabled = page === 1;
  prevBtn.onclick = () => {
    page--;
    startApp();
  };
  paginationContainer.appendChild(prevBtn);

  for (let i = 1; i <= totalPages; i++) {
    if (i < page - 2 || i > page + 2) continue;

    const btn = document.createElement('button');
    btn.textContent = i;
    btn.className = 'pagination-btn';

    if (i === page) {
      btn.classList.add('active');
    }

    btn.onclick = () => {
      page = i;
      startApp();
    };

    paginationContainer.appendChild(btn);
  }

  const nextBtn = document.createElement('button');
  nextBtn.textContent = 'Next';
  nextBtn.className = 'pagination-btn';
  nextBtn.disabled = page === totalPages;
  nextBtn.onclick = () => {
    page++;
    startApp();
  };
  paginationContainer.appendChild(nextBtn);
}

function filterAndRender(value) {
  query = value;
  page = 1;
  startApp();
}

async function startApp() {
  const data = await getEvents();

  const events =
    data && data._embedded && data._embedded.events
      ? data._embedded.events
      : [];

  const totalPages =
    data.page && data.page.totalPages ? data.page.totalPages : 1;

  allEvents = events;
  renderEvents(allEvents);
  renderPagination(totalPages);
  window.scrollTo(0, 0);
}

if (searchInput) {
  searchInput.addEventListener('input', e => {
    filterAndRender(e.target.value);
  });
}

eventsContainer.addEventListener('click', e => {
  const card = e.target.closest('.event-element');
  if (!card) return;

  toggleModal();
});

function toggleModal() {
  modalBackdrop.classList.toggle('is-hidden');
}

closeBtn.addEventListener('click', toggleModal);
modalBackdrop.addEventListener('click', e => {
  if (e.target === e.currentTarget) toggleModal();
});

startApp();
