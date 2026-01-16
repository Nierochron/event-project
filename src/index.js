const API_KEY = 'PGVpj5B2ke0spXMDy1QJDYveXLa7zjEE';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/events.json';

const eventsContainer = document.querySelector(".main-events-container")

async function getEvents() {
    try {
        const response = await fetch(`${BASE_URL}?apikey=${API_KEY}&size=20`)
        if (!response.ok) {
          throw new Error(`HTTP error ${response.status}`)
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error)
    }
}

async function renderEvents(events) {
  const markup = events.map((event) => {
    return `<li class="event-element"><p class="event-name">${event.name}</p><p class="event-time">${event.dates.start.localDate}</p></li>`
  }).join("")
  eventsContainer.innerHTML = markup
}

async function startApp() {
  const events = await getEvents()
  console.log(events)
  renderEvents(events._embedded.events)
}

startApp()