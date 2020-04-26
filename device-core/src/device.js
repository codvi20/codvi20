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
  this.GPS_RESOLUTION = 0;

   this.initMemory();
};

/**
 * Set and get my id.
 */
Device.prototype.setMyId = (myId) => this.MY_ID !== undefined ? this.MY_ID = myId : this.MY_ID;
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
    this.geoLocation().getCurrentPosition(async (position) => {
      const hashPosition = sha1(position.coords.latitude + "," 
          + position.coords.longitude);
      try {
        const response = await this.fetch('https://codvi20.oa.r.appspot.com/geopos',{
            method: 'post',
            headers: { "Content-Type": "text/json" },  
                    // Type application/json does not work in WebView ?
            body: JSON.stringify({ gps: hashPosition, id: this.getMyId() })
        });
        const myJson = await response.json();
        
        this.storeAnswer(myJson.nearIds);
      } catch(e) {
        //notifyError(e);
        console.log(e);
      }
    });
  };


  /**
   * Asks to server for infections related to my hashId.
   */
Device.prototype.askForInfection = async function() {
    try {
      const response=await this.fetch('https://codvi20.oa.r.appspot.com/infection',{
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
Device.prototype.initMemory = function initMemory() {
    let memory = this.localStorage().getItem("chain");
    if(memory===undefined) {
      memory = new Map();
    } else {
      this.clearMemory(memory, this.MAX_HISTORY);
    }
    this.localStorage().setItem("chain", memory);
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
    for(const x of memory.entries()) {
      if(x[0] < maxHistory) {
        memory.delete(x[0]);
     } else {
       // Iteration in a map is done in insertion order. See MDN doc.
        break;
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
    let v = nearIds.filter(info => 
        info.id !== this.getMyId()).map(info => info.id);

    if(v.length > 0) {
      let memory = this.localStorage().getItem("chain");
      this.clearMemory(memory, this.MAX_HISTORY);
      memory.set(Date.now(),  v);
      this.localStorage().setItem("chain", memory);
    }
  }


  /*
   * Checks in memory if there is match with infected reported ids.
   * params:
   *    infectedIds : and array of ["hashId"] with infected ids.
   *    minMatches : minimum of matches with an infected id to consider a match.
   */
Device.prototype.checkForInfection = function(infectedIds, minMatches) {
    let memory = this.localStorage().getItem("chain");
    this.clearMemory(memory, this.MAX_HISTORY);
    let matchDone = false;
    let matches = 0;
    outter: for(const arr of memory.entries()) {
      for(const neighbourId of arr[1]) {
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



