// const { default: getChessAPIData } = require("./Chess.com_API"); // how did this get here?

let outsideResolve;
let outsideReject;

function processChessData(data, message) {
  console.log(data);
  console.log(message);
  console.log('processChessData called!');
  let displayItems = {};
  let includedGames = ['chess_bullet', 'chess_blitz', 'chess_rapid', 'chess_daily', 'chess960_daily'];
  for (let game in data) {
    if (data.hasOwnProperty(game)) {
      if (includedGames.includes(game)) {
        Object.defineProperties(displayItems, {
          [game]: {
            value: {
              'latest rating': data[game].last.rating,
              'latest date': new Date(data[game].last.date * 1000)
              .toString().substring(0,21),
              'best rating': data[game].best.rating,
              'best date': new Date(data[game].best.date * 1000)
              .toString().substring(0,21),
              'latest GlickoRD': data[game].last.rd
            },
            enumerable: true
          }
        })
      }
    }
  }
  outsideResolve(displayItems)
} 

function getChessDataWithXHR(username) {
  return new Promise(function(resolve, reject) {
    outsideResolve = resolve;
    const httpRequest = new XMLHttpRequest();
    let url = `https://api.chess.com/pub/player/${username}/stats`;
    httpRequest.open('GET', url, true)
    httpRequest.send(null)
    httpRequest.onreadystatechange = function() {
      // console.log(httpRequest.responseText)
      if (httpRequest.readyState === httpRequest.DONE) {
        if (httpRequest.status === 200) {
          console.log('ok, status 200');
          let data = JSON.parse(httpRequest.responseText);
          let message = 'data obtained via XHR'
          processChessData(data, message)
        }
      }
    }
  })
}

function getChessDataWithFetch(username) {
  // reject unused here - to follow up?
  return new Promise(function(resolve, reject) {
    outsideResolve = resolve;
    // outsideReject = reject;
    let url = `https://api.chess.com/pub/player/${username}/stats`;
    // let url = 'https://jsonplaceholder.typicode.com/posts'
    fetch(url)
    .then(function(response) {
      let data = response.status === 200 ?
      response.json() : null;
      console.log(response)
      console.log(data)
      return response.ok ? data : Promise.reject(response)
    })
    .then(function(data) {
      processChessData(data)
    })
    .catch(function(error) {
      console.log(error);
      let errorData = {
        error: true,
        message: 'error retrieving data',
        code: error.status,
      }
      reject(errorData) //reject of returned Promise, not of fetch(), just so we're not confused
    })
  })
}


export {getChessDataWithFetch, getChessDataWithXHR};
// export {getChessDataWithXHR};