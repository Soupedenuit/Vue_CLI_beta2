// async function test(etag, method, parameters, options, callback, headers) {
//   try {
//     if (!etag || typeof etag != "string") throw "etag required for ifChanged";
//     if (!method || typeof method != 'function') throw "dispatch requires request function";
//     var actualParameters, actualCallback, actualOptions;
//     var items = [parameters, options, callback];
//     for (let i = 0; i < items.length; i++) {
//       if (!items[i]) continue;
//       if (items[i] instanceof Array) actualParameters = items[i];
//       else if (typeof items[i] == 'object') actualOptions = items[i];
//       else if (typeof items[i] == 'function') actualCallback = items[i];
//     }
    
//     let response = {changed: true, response: await method(...(actualParameters ? actualParameters : []), (actualOptions ? actualOptions : {}), (actualCallback ? actualCallback : null), {"If-None-Match": etag})};
//     return response;
//   } catch(error) {
//     return {changed: false};
//   }
// }

async function getChessAPIData(username) {
  // chessData will be either result or error
  // obtained from getLatestGamesData()
  let chessData = await fetchChessAPIData(username);
  console.log('chessData obtained from async function: ', chessData);
  return chessData
}

function ifChanged(etag, method, parameters, options, callback, headers) {
  try {
    if (!etag || typeof etag != "string") throw "etag required for ifChanged";
    if (!method || typeof method != 'function') throw "dispatch requires request function";
    var actualParameters, actualCallback, actualOptions;
    var items = [parameters, options, callback];
    for (let i = 0; i < items.length; i++) {
      if (!items[i]) continue;
      if (items[i] instanceof Array) actualParameters = items[i];
      else if (typeof items[i] == 'object') actualOptions = items[i];
      else if (typeof items[i] == 'function') actualCallback = items[i];
    }
    
    let response = {
      changed: true, 
      response: await method(...(actualParameters ? actualParameters : []), (actualOptions ? actualOptions : {}), (actualCallback ? actualCallback : null), {"If-None-Match": etag})};
    return response;
  } catch(error) {
    return {changed: false};
  }
}

module.exports = {ifChanged, getChessAPIData}