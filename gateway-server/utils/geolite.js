const Reader = require('@maxmind/geoip2-node').Reader;

const getCountry = async (ip) => {
  try {
    const reader = await Reader.open('./utils/GeoLite2/GeoLite2-Country.mmdb');
    const response = reader.country(ip);
    return response.country.isoCode;
  } catch (error) {
    return error.message;
  }
};

module.exports = getCountry;