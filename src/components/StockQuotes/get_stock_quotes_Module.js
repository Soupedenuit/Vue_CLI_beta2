function fetchQuotes({tickers, units, idNum}) { //tickers is an array
  // let tickers = arguments;
  return new Promise(function(resolve, reject) {
    let requests = [];
    let htmlReturnString = 'fetch failed!'; //default
    let quote = 'fetch failed!'; //default
    Array.from(tickers).forEach(ticker => {
      let url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${ticker}&apikey=QB7MY0MHLPZIQ39H`;
      let request = fetch(url);
      requests.push(request);
    });  
    Promise.all(requests)
    .then(function(results) {
      Promise.all(results.map(result => result.json()))
      .then(function(data) {
        console.log(data); // there is only one object in this array
        data.forEach(function(x, i) { 
          // let metaData = x['Meta Data'];
          // Object.keys(metaData).forEach(function(y) {
          //   console.log(`${y}:\n${metaData[y]}`)
          // });
          let timeSeries = x['Time Series (Daily)'];
          let today = Object.keys(timeSeries)[0];
          let todayClose = Number(timeSeries[today]['4. close']);
          let price = convertToDollars(todayClose);
          let dollarVal = Number(todayClose * units);
          let position = convertToDollars(dollarVal);
          // htmlReturnString = `${tickers[i]} current (or close) price: \$ ${price}<br>=> Net: \$ ${position}`;
          // quote = [tickers[i], price, position, idNum];
          quote = [tickers[i], units, idNum, price, position];
        })
        // return htmlReturnString;
        return quote; 
      })
      .then(function(value) {
        resolve(value)
        // console.log(htmlReturnString);
      })
      .catch(function(error) {
        console.log('Error (catch 1):', error)
        // reject(htmlReturnString)
        reject(error)
      })
      // return htmlReturnString
    })
    .catch(function(error) {
      console.log('Error (catch 2):', error)
      reject(error)
    })
  })

}

export default fetchQuotes