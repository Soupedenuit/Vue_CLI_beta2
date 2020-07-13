function fetchUSDexchangeRate() {
  return new Promise(function(resolve, reject) {
    let rate = 'fetch failed!'; //default
    let url = `https://api.exchangerate-api.com/v4/latest/USD`;
    let request = fetch(url);
    request.then(function(results) {
      console.log(results);
      return results.json()
    })
    .then(function(responseText) {
      // console.log(value.rates["CAD"])
      rate = responseText.rates["CAD"];
      return rate
    })
    .then(function(rate) {
      resolve(rate);
    })
    .catch(function(error) {
      console.log('Error:', error)
      reject(null)
    })
  })
}

export default fetchUSDexchangeRate