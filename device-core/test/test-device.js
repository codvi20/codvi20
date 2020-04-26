
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
device = require('../src/device.js')(localStorage, geoLocation, fetch);

let previousSetItem = memory.setItem;
memory.setItem = function(x,y) {
  previousSetItem(x,y);
  console.log(memory.getItem("chain"));
}
device.sendGeoInfo(111);
device.sendGeoInfo(111);
device.sendGeoInfo(111);

device.askForInfection(111, 2).then(x => console.log(x));
device.askForInfection(111, 1).then(x => console.log(x));
