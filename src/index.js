const API_KEY = 'PGVpj5B2ke0spXMDy1QJDYveXLa7zjEE';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

const eventsContainer = document.querySelector('.main-events-container');
const searchInput = document.getElementById('heroInputSearch');
let allEvents = [];

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
      event => `<li class="event-element"><img src="${getEventImage(event)}" width="200px" class="event-image"><p class="event-name">${event.name}</p><p class="event-time">${event.dates.start.localDate}</p></li>`
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
    const date = (ev.dates && ev.dates.start && ev.dates.start.localDate ? ev.dates.start.localDate : '').toLowerCase();
    return name.includes(q) || date.includes(q);
  });
  renderEvents(filtered);
}

async function startApp() {
  const data = await getEvents();
  const events =
    data && data._embedded && data._embedded.events ? data._embedded.events : [];
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
