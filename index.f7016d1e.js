fetch("https://app.ticketmaster.com/discovery/v2/events.json?apikey=PGVpj5B2ke0spXMDy1QJDYveXLa7zjEE").then((e=>{if(!e.ok)throw new Error(e.status);return e.json()})).then((e=>{console.log(e)})).catch((e=>{console.error(e)}));
//# sourceMappingURL=index.f7016d1e.js.map
