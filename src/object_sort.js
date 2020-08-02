import {convertToUTC} from '@/dateConverter.js';

let sampleData = {
  "chess_daily": {
    "latestRating": 1520,
    "latestDate": "Wed Apr 25 2018 00:53",
    "latestGlickoRD": 82,
    "bestRating": 1839,
    "bestDate": "Sun Feb 21 2010 19:32"
  },
  "chess960_daily": {
    "latestRating": 1366,
    "latestDate": "Tue Jun 24 2014 13:52",
    "latestGlickoRD": 137,
    "bestRating": 1512,
    "bestDate": "Mon Nov 18 2013 12:26"
  },
  "chess_rapid": {
    "latestRating": 1402,
    "latestDate": "Tue Jun 12 2018 13:02",
    "latestGlickoRD": 163,
    "bestRating": 1540,
    "bestDate": "Sun Feb 10 2013 02:13"
  },
  "chess_bullet": {
    "latestRating": 1322,
    "latestDate": "Sun Jul 26 2020 17:14",
    "latestGlickoRD": 68,
    "bestRating": 1354,
    "bestDate": "Sun Apr 16 2017 04:20"
  },
  "chess_blitz": {
    "latestRating": 1338,
    "latestDate": "Sat Aug 01 2020 00:18",
    "latestGlickoRD": 38,
    "bestRating": 1484,
    "bestDate": "Tue May 12 2020 11:58"
  }
};

function checkIfObject(obj) {
  if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
    console.log('the provided argument is not an object')
    return false;
  } else return true;
}

function sortObjectByKeys(obj, evalKey) {
  if (checkIfObject(obj)) {
    let valType;
    evalKey.match('Date') ?
    valType = 'date' :
    null;
    let sortedObj = {};
    let objKeys = Object.keys(obj);
    objKeys
    .sort(function(a, b) {
      if (valType === 'date') {
        return convertToUTC(obj[b][evalKey]) - convertToUTC(obj[a][evalKey])
      } else {
        return obj[b][evalKey] - obj[a][evalKey]
      }
    })
    .forEach(function(k) {
      sortedObj[k] = obj[k];
    });
    // console.log(`object sorted by key: ${JSON.stringify(sortedObj)}`);
    // return JSON.stringify(sortedObj)
    return sortedObj
  } else return null;
}

function sortObjectByValues(obj) {
  if (checkIfObject(obj)) {
    let sortedObj = {};
    let objVals = Object.values(obj);
    objVals
    .sort()
    .forEach(function(v) {
      for (let key in obj) {
        if (obj[key] === v) {
          sortedObj[key] = v;
        }
      }
    });
    // return JSON.stringify(sortedObj)
    return sortedObj
  } else return null;
}

// TESTING:
// console.log(sortObjectByKeys(sampleData));
// console.log(sortObjectByKeys(sampleData, 'latestRating'));

export {sortObjectByKeys, sortObjectByValues};