const express = require('express');
const app = express();
const bodyParser = require('body-parser')


// Milliseconds to keep in memory ids in the same geoposition
const LAPSE = 10000; // 10 seconds
const geoPos = {};


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));


app.get('/about', (req, res) => {
  res.send('Freedom in Spain now! Stop the coup d\'etat.');
});

app.post('/geopos', (req, res) => {
  const hashedGps = req.body.gps;
  const hashedId = req.body.id;
  const now = Date.now();
  const minTime = now - LAPSE;

  console.log("MIN TIME = " + minTime);
  console.log("NOW = " + now);

  let samePlacers = geoPos[hashedGps];
  if(samePlacers===undefined) {
    samePlacers = [];
    geoPos[hashedGps] = samePlacers;
  } else {
    for(;;) {
      if(samePlacers[0].time < minTime) {
        samePlacers.shift();
        console.log(samePlacers);

        if(samePlacers.length===0) break;
      } else {
        break;
      }
    }
  }

  samePlacers.push( { id : hashedId, time: now });
  res.json({ nearIds : samePlacers });
});


const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App listening at http://${host}:${port}`);
});
