<template>
  <div id="stock-quotes" class="display-flex translateX-50-percent-left">
    <section>
      <h1>{{title1}}</h1>
      <div id='stocks-container' class="display-flex">
        <form action="">
          <label for="input-ticker">Select stock ticker: </label>
          <input name="input-ticker" list="tickers-list" v-on:keydown.enter.prevent="submitTicker" type="text" id="input-ticker" placeholder="ticker..." pattern="[A-Z]+" value="" autocomplete="off" required />
          <datalist id="tickers-list">
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

  import eventHub from '@/eventHub.js';
  import fetchQuotes from './get_stock_quotes';
  import fetchUsdExchangeRate from './get_USD_exchange_rate';
  import {convertToDollars} from './convert_to_dollars.js';

  const targetId = document.getElementById.bind(document);
  const cachedDOM = {};
  // let outsideResolve;

  function cacheDOM() {
    cachedDOM.addTicker = targetId('add-ticker');
    cachedDOM.inputTicker = targetId('input-ticker');
    // NAV button to open stocks - not located in this file
    cachedDOM.stocksBtn = targetId('stocks-btn-svg-used');
    cachedDOM.stockQuotes = targetId('stock-quotes');
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
    fetchQuotes({tickers: tickers, units: units, idNum: idNum})
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
    return fetchQuotes({tickers: tickers, units: units, idNum: idNum})
  }

  let store = [];

  // populates local store with Firebase stocks upon login (called in firebaseAuthModule)
  const setStore = function() {
    let stocks = firebaseRDModule.firebaseDataStore.refToDoItemsSnapshotStocks.items || undefined;
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
    props: {
      title1: String
    },
    data: function() {
      return {
        stocksList1: [],
        stockIdNum: 101, //changed on login in to-do_firebase_RD
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
        fetchUsdExchangeRate()
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
      },
      emitMethod() {
        eventHub.$emit('alpha')
      }
    },
    mounted() {
      this.$nextTick(function() {
        cacheDOM()
        addListeners()
        defineProperties()
        console.log('hello from mounted');
        console.log(this.$root.cachedDOM2.test);
        eventHub.$on('alpha', this.getStocksList1);
      })
    }
  }
  

</script>


//Add to line 1 of the template to hide the stocks container:
// <div id="stock-quotes" class="display-none opacity-zero">


<style scoped>

</style>