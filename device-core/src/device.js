const sha1 = require('./sha1.js').sha1;
const myId = 111;
const MAX_HISTORY = 1000 * 3600 * 24 * 10; // 1000ms x seconds/h x h x days
const MIN_MATCHES = 4;  // 2 times with someone infected to consider in risk


//
// Previous usage. Define the following functions:
//    * localStorage() to return window.localStorage
//    * geoLocation() to return navigator.geolocation
//    * fetch() to fetch in browser
module.exports = function(localStorage, geoLocation, fetch) {
  /**
   * Sends geoposition to server asking for neighbors.
   * param: hashDeviceId = id of the device hashed
   */
  module.sendGeoInfo = function(hashDeviceId) {
    geoLocation().getCurrentPosition(async (position) => {
      const hashPosition = sha1(position.coords.latitude + "," 
          + position.coords.longitude);
      try {
        const response = await fetch('https://codvi20.oa.r.appspot.com/geopos',{
            method: 'post',
            headers: { "Content-Type": "text/json" },  
                    // Type application/json does not work in WebView ?
            body: JSON.stringify({ gps: hashPosition, id: hashDeviceId })
        });
        const myJson = await response.json();
        
        storeAnswer(myJson.nearIds);
      } catch(e) {
        //notifyError(e);
        console.log(e);
      }
    });
  };


  /**
   * Asks to server for infections related to my hashId.
   */
  module.askForInfection = async function(hashDeviceId, minMatches) {
    try {
      const response=await fetch('https://codvi20.oa.r.appspot.com/infection',{
            method: 'post',
            headers: { "Content-Type": "text/json" },  
                    // Type application/json does not work in WebView ?
            body: JSON.stringify({ id: hashDeviceId })
      });
      const myJson = await response.json();
      
      return checkForInfection(myJson.infectedIds, minMatches);
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
  let initMemory = function initMemory() {
    let memory = localStorage().getItem("chain");
    if(memory===undefined) {
      memory = new Map();
    } else {
      clearMemory(memory, MAX_HISTORY);
    }
    localStorage().setItem("chain", memory);
  };




  /*
   * Clear memory of oldest entries.
   * param:
   *    memory: a Map of millis -> entry
   *            This map will be affected!
   *    maxHistory: limit of time in past in milliseconds from now to preserve
   */
  const clearMemory = function(memory, maxHistory) {
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
  function storeAnswer(nearIds) {
    // Filter yourself, the server does not do it (or maybe yes, but who knows)
    let v = nearIds.filter(info => info.id !== myId).map(info => info.id);

    if(v.length > 0) {
      let memory = localStorage().getItem("chain");
      clearMemory(memory, MAX_HISTORY);
      memory.set(Date.now(),  v);
      localStorage().setItem("chain", memory);
    }
  }


  /*
   * Checks in memory if there is match with infected reported ids.
   * params:
   *    infectedIds : and array of ["hashId"] with infected ids.
   *    minMatches : minimum of matches with an infected id to consider a match.
   */

  function checkForInfection(infectedIds, minMatches) {
    let memory = localStorage().getItem("chain");
    clearMemory(memory, MAX_HISTORY);
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
  }


  initMemory();

  return module;
};


