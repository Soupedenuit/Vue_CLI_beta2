// Source: https://www.npmjs.com/package/chess-web-api
const ChessWebAPI = require('chess-web-api');

const chessAPI = new ChessWebAPI({
  queue: true // built in priority queue to avoid parallel requests
});

// To add something to the queue, use the method dispatch:  .dispatch(method, callback, parameters[array], options[object], priority[number], callbackParameters[array])

// Chess.com's API doesn't rate limit unless you've made parallel requests. If you have more than two active requests at a time, you'll receive a "429 Too Many Requests" error.

let outsideResolve;
let outsideReject;

function processChessData(response, error) {
  if (!error && response.statusCode === 200) {
    const result = response.body;
    // console.log(result);
    let displayItems = {};
    let includedGames = ['chess_bullet', 'chess_blitz', 'chess_rapid', 'chess_daily', 'chess960_daily'];
    for (let game in result) {
      if (result.hasOwnProperty(game)) {
        if (includedGames.includes(game)) {
          // console.log(game);
          // console.log(result[game]);
          Object.defineProperties(displayItems, {
            [game]: {
              value: {
                latestRating: result[game].last.rating,
                latestDate: new Date(result[game].last.date * 1000)
                .toString().substring(0,21),
                latestGlickoRD: result[game].last.rd,
                bestRating: result[game].best.rating,
                bestDate: new Date(result[game].best.date * 1000)
                .toString().substring(0,21)
              },
              enumerable: true
            }
          })
          //#region <unused code> - opted to use Object.defineProperties instead
          // displayItems[game].latestRating = game.result[game].last.rating;
          //   displayItems[game].latestDate = new Date(result[game].last.date * 1000)
          // .toString().substring(0,21);
          //   displayItems[game].latestGlickoRD = result[game].last.rd;
          // displayItems[game].bestRating = result[game].best.rating;
          // displayItems[game].bestDate = new Date(result[game].best.date * 1000)
          // .toString().substring(0,21);
          // }
          //#endregion
        }
      }
    }
    // for (let item in displayItems) {
    //   console.log(`${item}: ${displayItems[item]}`)
    // }
    outsideResolve(displayItems)
    // return displayItems
  } else {
      let errorMessage = {
        error: error.name,
        code: error.statusCode,
        message: error.message
      }
      outsideReject(errorMessage)
    }
}

function fetchChessAPIData(username) {
  // reject unused here - to follow up?
  return new Promise(function(resolve, reject) { 
    outsideResolve = resolve;
    outsideReject = reject;
    chessAPI.dispatch(chessAPI.getPlayerStats, processChessData, [username], {}, 1, [])
  })
}

async function getChessAPIData(username) {
  // chessData will be either result or error
  // obtained from processChessData()
  let chessData = await fetchChessAPIData(username);
  console.log('chessData obtained from async function: ', chessData);
  return chessData
}

export default getChessAPIData;