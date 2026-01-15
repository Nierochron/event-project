const API_KEY = 'PGVpj5B2ke0spXMDy1QJDYveXLa7zjEE';
const BASE_URL = 'https://app.ticketmaster.com/discovery/v2/';

fetch(`${BASE_URL}events.json?apikey=${API_KEY}`)
  .then(response => {
    if (!response.ok) throw new Error(response.status);
    return response.json();
  })
  .then(data => {
    console.log(data);
  })
  .catch(error => {
    console.error(error);
  });