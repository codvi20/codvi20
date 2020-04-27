const express = require('express');
const app = express();
const bodyParser = require('body-parser')


// Milliseconds to keep in memory ids in the same geoposition
const LAPSE = 10000; // 10 seconds. Why? Because there are 10 types of
                     // humans: those who know binary and those who don't
//
const INFECTION_MEMORY = 5 * 3600 * 24;  // 5 days of memory of an infection


// Short term (no older than LAPSE) memory of neighborhood
//    hashedGPS -> [{hashId, time},...]
const geoPos = {};

// Short term (no older than INFECTION TIME) memory for notified infections
//    [{time, infected hashId}...]
const infections = [];



// For debuugging
app.all('/echo', (req, res) => {
  res.json({ echo : req.headers, body: req.body});
});

// For justice and freedom
app.get('/help', (req, res) => {
  res.send('Freedom in Spain now! "Confinement" Confinement is not an ilegal massive house arrest and policial cup d\'etat');
});

// For telling you the instructions
app.get('/info', (req, res) => {
  let msg = '<html><body>Download the apk ';
  msg += '<a href="static/app-debug.apk">here</a>';
  msg += '<br/>Notify an infection for a hashId: ' 
  msg += '<a href="static/notify-infection.html">here</a>';
  msg += '</body></html>';
  res.send(msg);
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


// For asking for an infection 
app.post('/infection', (req, res) => {
  const now = Date.now();
  const minTime = now - INFECTION_MEMORY;
  const hashInfectedIdsArray = [];
  for(var i = infections.length-1; i>=0; i--) {
    if(infections[i][0] < minTime) {
      infections.splice(i, 1);
    } else {
      hashInfectedIdsArray.append(infections[i][1]);
    }
  }

  res.json({ infectedIds : hashInfectedIdsArray });
});


// For notifying of an infection 
app.get('/notify-infection', (req, res) => {
  var hashId = req.param("hashId", null);
  if(hashId==null) {
    res.send("Receive a null in parameter hashId");
  } else {
    infections.push([Date.now(), hashId]);
    res.send("Received and stored infection for hashId " + hashId);
  }
});



// The server, ready to run
app.use(bodyParser.json({type: '*/json'}));
const server = app.listen(8080, () => {
  const host = server.address().address;
  const port = server.address().port;

  console.log(`App listening at http://${host}:${port}`);
});
