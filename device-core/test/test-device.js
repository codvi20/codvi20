
const memory = {
  map: new Map(),
  getItem: (x) => memory.map.get(x),
  setItem: (x,y) => memory.map.set(x,y)
};

function localStorage() {
  return memory;
}

var latitude = 12.345;
var longitude = -67.890;
function geoLocation() {
  return {
    getCurrentPosition: function(callback) {
      callback({
        coords : {
          latitude : latitude,
          longitude : longitude
        }
      });
    }
  };
}


async function fetch(url) {
  if(url.endsWith('infection')) {
    return {
      json: function() {
        return {
          infectedIds : [1,2,3,4,5,222]
        };
      }
    };

  } else if(url.endsWith('geopos')) {
    return {
      json: function() {
        return {
          nearIds: [
            { id: 222, time: 9999 }
          ]
        };
      }
    };
  }
};

//
// Test cases
//
//
Device = require('../src/device.js').Device;
device = new Device(localStorage, geoLocation, fetch);
device.setMyId(111);
device.setMinInfectionMatches(2);

let previousSetItem = memory.setItem;
memory.setItem = function(x,y) {
  previousSetItem(x,y);
  console.log(memory.getItem("chain"));
}
device.sendGeoInfo();
device.sendGeoInfo();

device.askForInfection().then(x => console.log(x)).then(() => {
device.sendGeoInfo();
device.askForInfection().then(x => console.log(x));
});
