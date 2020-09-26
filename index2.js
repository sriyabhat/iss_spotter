const {nextISSTimesForMyLocation} = require('./iss_promised');



nextISSTimesForMyLocation()
  .then((result) =>{
    for (let item of result) {
      let datetime = new Date(0);
      datetime.setUTCSeconds(item.risetime);
      console.log(`Next pass at ${datetime} for ${item.duration} seconds!`);
    }
  });
//.catch(error => console.log(error));
  
 

 