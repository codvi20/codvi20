//
// Previous usage. Define the following functions:
//    * localStorage() to return window.localStorage
//    * geoLocation() to return navigator.geolocation
//    * fetch() to fetch in browser
var Device = function(localStorage, geoLocation, fetch) {
  this.localStorage = localStorage;
  this.geoLocation = geoLocation;
  this.fetch = fetch;

  this.MY_ID = 0;
  this.MIN_MATCHES = 0;
  this.MAX_HISTORY = 0;
  this.GPS_RESOLUTION = 0.01;

   this.initMemory();
};

/**
 * Set and get my id.
 */
Device.prototype.setMyId = (myId) => this.MY_ID = myId;
Device.prototype.getMyId = () => this.MY_ID;


  /**
   * Set min infection matches.
   */
Device.prototype.setMinInfectionMatches = minMatches => this.MIN_MATCHES = minMatches;

  /**
   * Set history of matches to remember.
   */
Device.prototype.setHistory = days => this.MAX_HISTORY = 1000*3600*days;


  /**
   * Sends geoposition to server asking for neighbors.
   * param: hashDeviceId = id of the device hashed
   */
Device.prototype.sendGeoInfo = function() {
  this.geoLocation().getCurrentPosition((position) => {
      const latitude=Math.round(position.coords.latitude / this.GPS_RESOLUTION) 
              * this.GPS_RESOLUTION;
      const longitude=Math.round(position.coords.longitude/this.GPS_RESOLUTION) 
              * this.GPS_RESOLUTION;
      const that = this;              
      for(const vars of [[0,0],[this.GPS_RESOLUTION,0],[-this.GPS_RESOLUTION,0],
          [0,this.GPS_RESOLUTION],[0,-this.GPS_RESOLUTION]]) {
        const hashPosition=sha1((latitude+vars[0]) + "," + (longitude+vars[1]));
        this.fetch(
          'https://codvi20.oa.r.appspot.com/geopos', {
            method: 'post',
            headers: { "Content-Type": "text/json" },  
                    // Type application/json does not work in WebView ?
            body: JSON.stringify({ gps: hashPosition, id: that.getMyId() })
        }).then(function(response) {
            return response.json();
        }).then(function(myJson) {
            console.log(JSON.stringify(myJson));
            that.storeAnswer(myJson.nearIds);
        });
      }
  }, (error) => console.log(error), {
        enableHighAccuracy: false,
        timeout: 5000,
        maximumAge: 0
  });
};


/**
 * Asks to server for infections related to my hashId.
 * returns: true if it matches with an infection
 */
Device.prototype.askForInfection = async function() {
    try {
      const response=await 
        this.fetch('https://codvi20.oa.r.appspot.com/infection',{
            method: 'post',
            headers: { "Content-Type": "text/json" },  
                    // Type application/json does not work in WebView ?
            body: JSON.stringify({ id: this.getMyId() })
      });
      const myJson = await response.json();
      return this.checkForInfection(myJson.infectedIds, this.MIN_MATCHES);
    } catch(e) {
      //notifyError(e);
       console.log(e);
    }
  };




/////// INNER FUNCTIONS ----------------
//

/**
 * Initialize memory and purges old elements.
 */
Device.prototype.initMemory = function() {
  let memory = this.localStorage().getItem("chain");
  if(memory===undefined) {
    memory = {};
  } else {
    memory = JSON.parse(memory);
    this.clearMemory(memory, this.MAX_HISTORY);
  }
  this.localStorage().setItem("chain", JSON.stringify(memory));
};




/*
 * Clear memory of oldest entries.
 * param:
 *    memory: a Map of millis -> entry
 *            This map will be affected!
 *    maxHistory: limit of time in past in milliseconds from now to preserve
 */
Device.prototype.clearMemory = function(memory, maxHistory) {
  const miHhistoryTime = Date.now()-maxHistory;
  for(const x in memory) {
    if(x < maxHistory) {
      delete memory[x];
    }
  }
};



/*
 * Stores in local storage the list of near devices.
 * params:
 *    nearIds : an array of { "id", "time" } structure with ids of near ids
 *              and the notification time
 */
Device.prototype.storeAnswer =  function(nearIds) {
  // Filter yourself, the server does not do it (or maybe yes, but who knows)
  const that = this;
  let v = nearIds.filter(info => 
      info.id !== that.getMyId()).map(info => info.id);

  if(v.length > 0) {
    let memory = JSON.parse(this.localStorage().getItem("chain"));
    this.clearMemory(memory, this.MAX_HISTORY);
    memory[Date.now()] = v;
    this.localStorage().setItem("chain", JSON.stringify(memory));
  }
  console.log(this.localStorage().getItem("chain"));
}


/*
 * Checks in memory if there is match with infected reported ids.
 * params:
 *    infectedIds : and array of ["hashId"] with infected ids.
 *    minMatches : minimum of matches with an infected id to consider a match.
 */
Device.prototype.checkForInfection = function(infectedIds, minMatches) {
  let memory = JSON.parse(this.localStorage().getItem("chain"));
  this.clearMemory(memory, this.MAX_HISTORY);
  let matchDone = false;
  let matches = 0;
  outter: for(const arr in memory) {
    for(const neighbourId of memory[arr]) {
      matches += infectedIds.reduce(
            (accum, id) => accum += id===neighbourId ? 1 : 0, 0);
      if(matches>minMatches) {
        break outter;
      }
    }
  }
  return matches>minMatches;
};



var require;
if(require!==undefined) {
  const sha1 = require('./sha1.js').sha1;
  module.exports.Device = Device;
}



