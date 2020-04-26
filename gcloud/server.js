const express = require('express');
const app = express();
const bodyParser = require('body-parser')


// Milliseconds to keep in memory ids in the same geoposition
const LAPSE = 10000; // 10 seconds. Why? Because there are 10 types of
                     // humans: those who know binary and those who don't
const geoPos = {};


app.use(bodyParser.json({type: '*/json'}));

// For debuugging
app.all('/echo', (req, res) => {
  res.json({ echo : req.headers, body: req.body});
});

// For justice and freedom
app.get('/about', (req, res) => {
  res.send('Freedom in Spain now! Stop the coup d\'etat.');
});

// For asking for neighbors
// response: a json with : { "nearIds" : [ array of { "id", "time" } ] }
app.post('/geopos', (req, res) => {
  const hashedGps = req.body.gps;
  const hashedId = req.body.id;
  const now = Date.now();
  const minTime = now - LAPSE;

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
