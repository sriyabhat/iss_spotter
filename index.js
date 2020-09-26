const { nextISSTimesForMyLocation } = require('./iss');

nextISSTimesForMyLocation((error,result) => {
  if (error) {
    console.log('It didnt Work! ', error);
    return;
  }

  for (let item of result) {
    let datetime = new Date(0);
    datetime.setUTCSeconds(item["risetime"]);
    console.log(`Next pass at ${datetime} for ${item["duration"]} seconds!`);
  }
  //console.log(result);
});





