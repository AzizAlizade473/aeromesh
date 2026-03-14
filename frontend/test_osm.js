const fetch = require('node-fetch');
const https = require('https');

const OVERPASS_URL = 'https://overpass-api.de/api/interpreter';
const query = `
  [out:json][timeout:30];
  (
    relation["type"="route"]["route"="bus"]
      (40.30,49.70,40.60,50.15);
  );
  out body;
  >;
  out skel qt;
`;

const httpsAgent = new https.Agent({ rejectUnauthorized: false });

fetch(OVERPASS_URL, {
  method: 'POST',
  body: `data=${encodeURIComponent(query)}`,
  headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
  agent: httpsAgent
})
  .then(r => {
    console.log("Status:", r.status);
    return r.text();
  })
  .then(text => {
    try {
      const data = JSON.parse(text);
      console.log("Found", data.elements.length, "elements.");
      const routes = data.elements.filter(e => e.type === 'relation' && e.tags?.route === 'bus');
      console.log("Found", routes.length, "bus routes.");
    } catch(e) {
      console.log("Failed to parse JSON:", text.substring(0, 500));
    }
  })
  .catch(console.error);
