if (!window) {
  const fetch = require('node-fetch');
}

//determines which method to use to get data:
function getChessAPIData(username) {
  let url = `https://api.chess.com/pub/player/${username}/stats`;
  return new Promise(function(resolve, reject) {
    if (window.hasOwnProperty('fetch')) {
      getChessAPIDataWithFetch(url, resolve, reject)
    } else getChessAPIDataWithXHR(url, resolve, reject)
  })
}

function getChessAPIDataWithFetch(url, resolve1, reject1) {
    console.log('fetch() method called!')
    let message = 'data obtained via fetch()';
    fetch(url)
    .then(function(response) {
      console.log('fetch.then called!')
      let data = response.status === 200 ?
      response.json() : null;
      console.log(response)
      console.log(data)
      return response.ok ? data : Promise.reject(response) 
      //Promise.reject forces catch() if response.ok is false
    })
    .then((data) => processChessData(data, message, resolve1))
    .catch(function(response) {
      console.log('fetch().catch() called!')
      console.log('error: ', response.status)
      processError(`response status ${response.status}`, reject1, 'error from fetch')
    })
}

function getChessAPIDataWithXHR(url, resolve1, reject1) {
  console.log('XHR method called!');
  const xhr = new XMLHttpRequest();
  xhr.open('GET', url, true)
  xhr.onreadystatechange = function() {
    // console.log(xhr.responseText)
    if (xhr.readyState === xhr.DONE) { //value: 4
      let data = JSON.parse(xhr.responseText);
      if (xhr.status === 200) {
        console.log('ok, status 200')
        let message = 'data obtained via XHR'
        processChessData(data, message, resolve1)
      } else {
        // console.log(xhr.responseText)
        console.log(data)
        processError(data.message, reject1, 'error from xrh')
      }
    }
  }
  xhr.send(null)
}

function processChessData(data, message, resolve) {
  console.log('processChessData called!')
  console.log('data: ', data)
  console.log('message: ', message)
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
  resolve(displayItems)
} 

function processError(errorMsg, reject, other) {
  console.log('processError called!')
  console.log('errorMsg: ', errorMsg)
  console.log(other);
  let errorData = {
    error: true,
    message: errorMsg,
    // code: errorMsg.status,
  }
  reject(errorData)
}

function getChessAPIUserAvatar(username) {
  let url = `https://api.chess.com/pub/player/${username}`;
  // let url = `https://api.chess.com/pub/player/sstoehr`;
  return new Promise(function(resolve, reject) {
    if (window.hasOwnProperty('fetch')) {
      fetch(url)
      .then(function(response) {
        let data = response.status === 200 ?
        response.json() : null;
        console.log(data);
        return response.ok ? data : Promise.reject(response)
      })
      .then((response) => resolve(response.avatar))
      .catch(function(response) {
        console.log('error: ', response.status)
        reject('(avatar fetch failed!)')
      })
    } else null
  })
}


export {getChessAPIData, getChessAPIUserAvatar};