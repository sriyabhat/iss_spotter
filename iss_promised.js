const request = require('request-promise-native');

const fetchMyIP = function() {
  return request('https://api.ipify.org?format=json');
};

const fetchCoordsByIP = function(ip) {
  const ipAddress = JSON.parse(ip).ip;
  return request(`https://ipvigilante.com/${ipAddress}`);
};

const fetchFlyOverTimes = function(cordinates) {
  const {latitude, longitude} = JSON.parse(cordinates).data;
  return request(`http://api.open-notify.org/iss-pass.json?lat=${latitude}&lon=${longitude}`);
};

const nextISSTimesForMyLocation = function() {
  return fetchMyIP()
    .then(fetchCoordsByIP)
    .then(fetchFlyOverTimes)
    .then(result => {
      const {response} = JSON.parse(result);
      return response;
    });
};


module.exports = {nextISSTimesForMyLocation};