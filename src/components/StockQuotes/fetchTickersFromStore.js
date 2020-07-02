//called by setStore
function fetchTickersFromStore() {
  // return new Promise(function(resolve, reject) {
    let requests = [];
    if ( store.length ) {
      store.forEach(function(x) {
        let key = Object.keys(x)[0];
        let val = Object.values(x)[0];
        let idNum = key;
        let tickers = [val.ticker];
        let units = val.units;
        return new Promise(function(resolve, reject) {
          let request = getStockQuotesModule.fetchQuotes({tickers: tickers, units: units})
          .then(function(value) {
            return value
          })
        })
        let request = getStockQuotesModule.fetchQuotes({tickers: tickers, units: units})
        .then(function(value) {
          return value
        })
        requests.push(request);
      });
    }
    Promise.all(requests)
    .then(function(data) {
      data.forEach(function(x, i) {
        console.log(x)
      })
    })
    .catch(function(error) {
      console.log('Error:', error)
      // reject(htmlReturnString)
      reject(error)
    })
  // })
}  