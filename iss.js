
const request = require('request');



const fetchMyIP = function(callback) {
  let message = '';
  request('https://api.ipify.org?format=json',(error,response,body) => {
    if (error) {
      callback(error,null);
    } else {
      switch (response && response.statusCode) {
      case 200 :
        if (body !== '[]') {
          let IP = JSON.parse(body);
          callback(null,IP["ip"]);
        } else {
          callback('IP address is not found', null);
        }
        break;
  
      default :
        message = `Status Code ${response.statusCode} when fetching IP. Response : ${body}`;
        callback(Error(message), null);
        break;
      }
    }
  });
};

const fetchCoordsByIP = function(ipAddress,callback) {

  request(`https://ipvigilante.com/${ipAddress}`, (error,response,body) => {
    let message = "";
    if (error) {
      callback(error,null);
    } else {
      if (response.statusCode === 200) {
        if (body !== '[]') {
          let geoInformation = JSON.parse(body);
          let cordinates = {latitude : geoInformation['data']['latitude'], longitude : geoInformation['data']['longitude']};
          callback(null,cordinates);
        } else {
          callback('Co-ordinates not found', null);
        }
      } else {
        message = `Status Code ${response.statusCode} when fetching Co-ordinates. Response : ${body}`;
        callback(Error(message), null);
      }
    }

  });
};


/**
 * Makes a single API request to retrieve upcoming ISS fly over times the for the given lat/lng coordinates.
 * Input:
 *   - An object with keys `latitude` and `longitude`
 *   - A callback (to pass back an error or the array of resulting data)
 * Returns (via Callback):
 *   - An error, if any (nullable)
 *   - The fly over times as an array of objects (null if error). Example:
 *     [ { risetime: 134564234, duration: 600 }, ... ]
 */
const fetchISSFlyOverTimes = function(coords, callback) {

  request(`http://api.open-notify.org/iss-pass.json?lat=${coords.latitude}&lon=${coords.longitude}`, (error,response,body) => {
    let message = "";

    if (error) {
      callback(error,null);
      return;
    }

    if (response.statusCode !== 200) {
      message = `Status Code ${response.statusCode} when fetching ISS fly over times. Response : ${body}`;
      callback(Error(message),null);
      return;
    }

    if (body === '[]') {
      message = 'No ISS Fly over times for';
      callback(Error(message),null);
      return;
    }

    let flyOverTimes = JSON.parse(body);
    callback(null,flyOverTimes["response"]);

  });
};


const nextISSTimesForMyLocation = function(callback) {

  fetchMyIP((error, ip) => {
  
    if (error) {
      callback(error,null);
      return;
    }
    
    fetchCoordsByIP(ip, (e,cordinates) => {
      if (e) {
        callback(e,null);
        return;
      }
       
      //c = {latitude :85.36450, longitude:-455.79340 };
      fetchISSFlyOverTimes(cordinates,(err, flyOverTimes) => {
        if (err) {
          callback(err,null);
          return;
        }
  
        callback(null,flyOverTimes);
        
      });
    });
  
  });

};

module.exports = {nextISSTimesForMyLocation};