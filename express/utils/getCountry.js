// Asynchronous database opening
const Reader = require('@maxmind/geoip2-node').Reader;

Reader.open('GeoLite2-Country.mmdb').then(reader => {
  const response = reader.country('132.144.59.68');

  console.log(response.country.isoCode);
  console.log(response.traits.connectionType);
});