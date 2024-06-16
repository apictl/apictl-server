const validateEmail = (email) => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
};

const validatePassword = (password) => {
  return String(password).match(
    /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/
  );
};

const validateUrl = (url) => {
  return String(url).match(
    /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/
  );
};

const validateLocalhost = (url, schemeRequired = true) => {
  return String(url).match(
    schemeRequired
      ? /^https?:\/\/(localhost|0|10|127|192(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1?\])$/gi
      : /^(localhost|0|10|127|192(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}|\[::1?\])$/gi
  );
};

const validateDomain = (domain) => {
  return String(domain).match(/^[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,}$/i);
};

const validateShaKey = (shaKey) => {
  return String(shaKey).match(/^([a-zA-Z0-9]{2}:){31}[a-zA-Z0-9]{2}$/i);
};

module.exports = {
  validateEmail,
  validatePassword,
  validateUrl,
  validateLocalhost,
  validateDomain,
  validateShaKey,
};
