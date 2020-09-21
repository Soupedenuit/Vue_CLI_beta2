// Source: https://www.npmjs.com/package/chess-web-api
//testing:
function getChessAPIData() {
  let data = {
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
      "latestRating (test data)": 1273,
      "latestDate": "Mon Sep 07 2020 16:34",
      "latestGlickoRD": 35,
      "bestRating": 1484,
      "bestDate": "Tue May 12 2020 11:58"
    }
  };
  return Promise.resolve(data)
}


export default getChessAPIData;