<template>
  <div id="stock-quotes" class="display-flex translateX-50-percent-left">
    <section>
      <h1>{{title1}}</h1>
      <div id='stocks-container' class="display-flex">
        <form action="">
          <label for="input-ticker">Select stock ticker: </label>
          <input name="input-ticker" list="tickers-list" v-on:keydown.enter.prevent="submitTicker" type="text" id="input-ticker" placeholder="ticker..." pattern="[A-Z]+" value="" autocomplete="off" required />
          <datalist id="tickers-list">
            <!-- <option v-for="ticks in tickersList"
            v-bind:key="ticks.id" v-bind:value="ticks.text">
            </option> -->
            <option v-for="(ticks, index) of tickersList1"
            v-bind:key="index" v-bind:value="ticks">
            </option>
          </datalist>
          <button v-on:click="submitTicker" id="add-ticker" type="button">add</button>
        </form>
        <table>
          <caption>A list of stock tickers, prices & positions</caption>
          <thead>
            <tr>
              <th>ticker</th>
              <th>units</th>
              <th>close</th>
              <th>position</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="stocks in stocksList1" v-bind:key="stocks.id" v-html="stocks.text">
            </tr>
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">
                <div>Total USD:</div>
              </td>
              <td>
                <div>{{totalUSD}}</div>
              </td>
            </tr>
            <tr>
              <td colspan="3">
                <div>Total CAD:</div>
              </td>
              <td>
                <div>{{totalCAD}}</div>
              </td>
            </tr>
            <tr>
              <td colspan="4">
                <div style="text-align:right;width:100%;font-size:0.8em;">{{totalCADText}}</div>
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </section>
  </div>

</template>


<script>

  const targetId = document.getElementById.bind(document);
  const cachedDOM = {};
  // let outsideResolve;

  function cacheDOM() {
    cachedDOM.addTicker = targetId('add-ticker');
    cachedDOM.inputTicker = targetId('input-ticker');
    cachedDOM.stocksBtn = targetId('stocks-btn-svg-used');
    cachedDOM.stockQuotes = targetId('stock-quotes');
    cachedDOM.test = 'cachedDOM test';
  }

  function addListeners() {
    cachedDOM.stocksBtn.addEventListener('click', openStockQuotes, false);
  }

  let alpha = {};
  function defineProperties() {
    alpha.a = stock_quotes_vue_instance.stockQuotesStatus;
  }

  function openStockQuotes() {
    let action1;
    let action2;
    if (!alpha.a) {
      action1 = 'add';
      action2 = 'remove';
      alpha.a = true;
    } else {
      action2 = 'add';
      action1 = 'remove';
      alpha.a = false;
    } 
    cachedDOM.stockQuotes.classList[action1]('translateY-slider-stocks');
    cachedDOM.stockQuotes.classList[action2]('translateX-50-percent-left');
  }
  
  // Step 1 (called by submitTicker)
  function fetchQuotesAndAddToList({idNum, tickers, units}) {
    getStockQuotesModule.fetchQuotes({tickers: tickers, units: units, idNum: idNum})
    .then(function(value) { //value is [tickers[i], units, idNum, price, position];
      addTickerQuoteToList({quote: value, result: 'yes'})
    })
    .catch(function(error) {
      console.log('Error:', error)
      addTickerQuoteToList({quote: error, result: 'no'})
    })
  }

  // Step 2 (called by step 1, or by fetchTickersFromStore):
  function addTickerQuoteToList({quote, result}) {
    let newText;
    let ticker = quote[0];
    let units = quote[1];
    let id = quote[2];
    let price = quote[3];
    let position = quote[4];
    let htmlString1 = `
      <td>${ticker}</td>
      <td>${units}</td>
      <td>${price}</td>
      <td>${position}</td>
    `;
    let htmlString2 = `
      <td colspan='3' style='text-align:center;'>could not retrieve quotes!</td>
    `;
    result === "yes" ? newText = `${htmlString1}`:   newText = `${htmlString2}`;
    let newObj = {
      id: id,
      text: newText,
      position: convertFromDollars(position)
    };
    let stocksList = stock_quotes_vue_instance.$refs.stockQuotes.stocksList1;
    stocksList.push(newObj);
    console.log('newObj.id: ' + newObj.id);
    console.log('newObj.text: ' + newObj.text);
    // stock_quotes_vue_instance.stocksList2.push(newObj);
  }
  
  //called by submitTicker
  function addTickerToFirebase(item) {
    firebaseRDModule.addToFirebaseRD_Stocks(item)
  }

  //called by submitTicker
  function addStockIdNumToFirebase(val) {
    firebaseRDModule.addToFirebaseRD_Stocks_idNum(val)
  }
  
  //called by setStore
  function fetchTickersFromStore() {
    // let stocksList = stock_quotes_vue_instance.$refs.stockQuotes.stocksList1;
    let requests = store.map(asyncOperation); 
    return Promise.all(requests)
    .then(function(results) {
      console.log(results)
      results.forEach(function(result) {
        addTickerQuoteToList({quote: result, result: 'yes'})
      })
      // return results
    })
    .catch(function(error) {
      console.log('Error:', error)
      addTickerQuoteToList({quote: error, result: 'no'})
      // reject(error) //unnecessary if not returning value
    })
  }
  
  function asyncOperation(x) {
    let key = Object.keys(x)[0];
    let val = Object.values(x)[0];
    let idNum = key;
    let tickers = [val.ticker]; //fetchQuotes accepts an array
    let units = val.units;
    return getStockQuotesModule.fetchQuotes({tickers: tickers, units: units, idNum: idNum})
  }

  // console.log('hello from stockQuotesModule');
   
  const waitForfirebaseRDModuleToLoad = (function() {
    return new Promise(function(resolve, reject) {
      outsideResolve = resolve;
    });
  })()
  .then(function() {
    firebaseRDModule.testStockQuotesModule();
    //ZZ
  })

  let store = [];

  // for console testing purposes only
  const getStore = function() {
    return store;
  };

  // populates local store with Firebase stocks upon login (called in firebaseAuthModule)
  const setStore = function() {
    let stocks = firebaseRDModule.firebaseDataStore.refToDoItemsSnapshotStocks.items || undefined;
    stock_quotes_vue_instance.login = true; //not used
    if ( stocks ) {
      Object.keys(stocks).forEach(function(x) {
        if ( x !== 'idNum' ) {
          let val = stocks[x];
          store.push({[x]: val});
        }
      });
    };
    fetchTickersFromStore();
  };

   // clears local store upon logout (called in firebaseAuthModule)
  const clearStore = function() {
    store = [];
    stock_quotes_vue_instance.$refs.stockQuotes.stocksList1 = [];
    stock_quotes_vue_instance.login = false;
  };

  export default {
    


  const stock_quotes_vue_component = {
    props: {
      title1: String
    },
    template: stock_quotes_template,
    data: function() {
      return {
        cachedDOM1: { //NOT USED, NOT ACCESSIBLE
          addTicker: targetId('add-ticker'),
          inputTicker: targetId('input-ticker'),
          test: 'cachedDOM1 Test'
        },
        stocksList1: [
          // {id: 0, text: '<p>stock 1</p>'},
          // {id: 1, text: '<p>stock 2</p>'},
          // {id: 2, text: '<p>stock 3</p>'}
          // {id: 0, text: '<th>ticker</th><th>close</th><th>position</th>'}
        ],
        stockIdNum: 101, //changed on login in to-do_firebase_RD
        tickersList: [
          {id: 0, text: 'ACB.TO'},
          {id: 1, text: 'AUSA.CN'},
          {id: 2, text: 'BB.TO'},
          {id: 3, text: 'BTC-USD'},
          {id: 4, text: 'BKE'},
          {id: 5, text: 'GGN'},
          {id: 6, text: 'HCC'},
          {id: 7, text: 'MEDFF'},
          {id: 8, text: 'MLI'},
          {id: 9, text: 'MMJ.CN'},
          {id: 10, text: 'SNN.CN'},
          {id: 11, text: 'VIVO.V'},
          {id: 12, text: 'WERN'},
          {id: 13, text: 'XRX'},
          {id: 14, text: '_____'},
          {id: 15, text: 'AAPL'},
          {id: 16, text: 'AMZN'},
          {id: 17, text: 'FB'},
          {id: 18, text: 'GOOG'},
          {id: 19, text: 'NFLX'},
          {id: 20, text: 'TWTR'},
          {id: 21, text: 'WORK'}
        ],
        tickersList1: [
          'ACB.TO',
          'AUSA.CN',
          'BB.TO',
          'BTC-USD',
          'BKE',
          'GGN',
          'HCC',
          'MEDFF',
          'MLI',
          'MMJ.CN',
          'SNN.CN',
          'VIVO.V',
          'WERN',
          'XRX',
          '_____',
          'AAPL',
          'AMZN',
          'FB',
          'GOOG',
          'NFLX',
          'TWTR',
          'WORK'
        ],
        totalCAD: '$ 0.00',
        totalCADText: ''
      }
    },
    computed: {
      listLength() {
        let itemsCount = this.stocksList1.length;
        return itemsCount;
      },
      positionsTotal() {
        if (this.listLength) {
          let total = this.stocksList1.reduce(function(acc, cur) {
            let pos = Number(cur.position);
            return acc + pos;
          }, 0);
          return total
        } else return 0;
      },
      //THIS SHOULD BE MOVED TO A METHOD.
      //COMPUTED PROPERTIES SHOULD NOT BE ASYNC
      totalUSD() {
        // if (this.listLength) {
        let total = this.positionsTotal;
        let updateTotalCAD = this.updateTotalCAD;
        let updateTotalCAD_fail = this.updateTotalCAD_fail;
        getUSDexchangeRateModule.fetchUSDexchangeRate()
        .then(function(value) {
          let canadianVal = total * value;
          updateTotalCAD(canadianVal) 
        })
        .catch(function(error) {
          console.log('Error:', error)
          updateTotalCAD_fail() 
        })
        return convertToDollars(total)
      }
    },
    methods: {
      submitTicker(arg1) {
        console.log(arg1);
        let val = cachedDOM.inputTicker.value.toUpperCase();
        cachedDOM.inputTicker.value = '';
        let end = val.length + 1;
        let splitIndex;
        if ( val.includes(' ') ) {
          splitIndex = val.indexOf(' ');
        } else splitIndex = end;
        let ticker = val.substring(0, splitIndex).toUpperCase();
        let units = Number(val.substring(splitIndex, end));
        // let idNum = this.listLength + 1;
        let idNum = this.stockIdNum;
        this.stockIdNum++;
        // firebaseRDModule.getrefToDoItems_stocks_idNum().set(this.stockIdNum); //ZZZ 
        // let idNum = toDoInstance.itemCounter;
        let tickers = [ticker];
        console.log(tickers);
        fetchQuotesAndAddToList({idNum: idNum, tickers: tickers, units: units});
        let item = {
          [idNum]: {
            ticker: ticker,
            units: units
          }
        }
        addTickerToFirebase(item);
        addStockIdNumToFirebase(this.stockIdNum);
      },
      updateTotalCAD(val) {
        this.totalCAD = convertToDollars(val);
      },
      updateTotalCAD_fail() {
        this.totalCADText = '(could not retrieve exchange rate)';
      },
      getStocksList1() {
        console.log(this.stocksList1[0].text);
        return this.stocksList1;
      }
    },
    mounted() {
      this.$nextTick(function() {
        cacheDOM()
        addListeners()
        defineProperties()
        console.log('hello from mounted');
        console.log(this.$root.cachedDOM2.test);
        emitHub.$on('alpha', this.getStocksList1);
      })
    }
  
  
  </script>


  const emitHub = new Vue();

  const stock_quotes_vue_instance = new Vue({
    el: '#stock-quotes-vue-component',
    components: {
      'stock-quotes': stock_quotes_vue_component
    },
    data: {
      cachedDOM2: { //NOT USED, NOT ACCESSIBLE
        addTicker: targetId('add-ticker'),
        inputTicker: targetId('input-ticker'),
        test: 'cachedDOM2 test'
      },
      stocksList2: [ //NOT USED, NOT ACCESSIBLE
        {id: 0, text: '<p>stock 4</p>'},
        {id: 1, text: '<p>stock 5</p>'},
        {id: 2, text: '<p>stock 6</p>'}
      ],
      login: false, //not used,
      stockQuotesStatus: false //indicates if stockQuotes window is open or not
    },
    methods: {
      emitMethod() {
        emitHub.$emit('alpha')
      }
    },
    mounted() {
      this.$nextTick(function() {
        console.log(this.$refs.stockQuotes.tickersList1);
      })
    }
  });

  // Using Vue's v-on directive instead of adding event listener:
  // alpha.cachedDOM1.addTicker.addEventListener('click', submitTicker, false);

  // return {
  //   cachedDOM,
  //   clearStocksStore: clearStore,
  //   emitMethod: stock_quotes_vue_instance.emitMethod,
  //   openStockQuotes,
  //   outsideResolve,
  //   setStocksStore: setStore,
  //   stock_quotes_vue_component,
  //   stock_quotes_vue_instance,
  //   store: getStore
  // }



/*
Add to line 1 of the template to hide the stocks container:
<div id="stock-quotes" class="display-none opacity-zero">
*/


/*
NOTES:
You can access the component via the parent instance as     follows:

A. By using the $refs instance property (add attribute ref to your component in HTML tag). In our case we named it "stockQuotes":
stockQuotesModule.stock_quotes_vue_instance.$refs.stockQuotes

B. By using the $emit and $on instance methods. It seems though that you cannot get a return value from its callback function.

*/