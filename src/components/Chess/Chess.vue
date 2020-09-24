<template>
  <main>
    <!-- switched to using a prop -->
    <!-- <input type="text" autocomplete="on" v-model="username"  -->
    <form>
      <label for="userNameInput">Username: </label>
      <input name="userNameInput" type="text" autocomplete="on" 
      v-model="userName" 
      v-on:keydown.enter.prevent="getChessData">
      <!-- <select name="userName" id="user-name" v-on:keydown.enter.prevent="getChessData">
        <option value="knightofthedead">knightofthedead</option>
      </select> -->
    </form>

    <article ref="chessGames" v-if="showData">
      <span id="userDisplay">user: {{userName}}</span>
      <section v-for="(game, key, index) in chessData"
      v-bind:key="key">
        <h2>{{filterKey(key)}}</h2>
        <ul v-if="showData">
          <li ref="chessData" v-for="(stat, key) in game"
          v-bind:key="key" >
          {{key}}: {{stat}}
          </li>
        </ul>
        <hr v-if="index < (Object.keys(chessData).length - 1)">
      </section>
    </article>

    <article v-if="showError">
      <section class="margin-top-10"
      v-for="(message, key) in errorData"
      v-bind:key="key">
      {{key}}: {{message}}
      </section>
    </article>

  </main>

</template>


<script>
  // Using ChessWebAPI:
  // import {getChessAPIData} from './Chess.com_API.js';
  // Using local Object for testing:
  // import {getChessAPIData} from './Chess.com_API_simple.js';
  // Using chess.com API endpoints without ChessWebAPI:
  // import {getChessAPIDataWithFetch, getChessAPIDataWithXHR} from './Chess.com_no_lib.js';
  import {getChessAPIData} from './Chess.com_no_lib.js';
  import {convertToUTC} from '@/dateConverter.js';
  import {sortObjectByKeys} from '@/object_sort.js';
  import {nextTick} from 'vue';

  export default {
    name: 'Chess',
    data: () => ({
      chessData: null,
      showData: false,
      errorData: null,
      showError: true,
      interval_a: null,
      activated: true, //to prevent activated hook from setting interval on initial load
      userName: null
    }),
    props: {
      delay: String,
      user: String
    },
    computed: {
      // chessDataResult() {
      //   if (this.chessData) {
      //     if (this.chessData.hasOwnProperty('error')) {
      //       let errorData = {
      //         message: this.chessData.message,
      //         'error code': this.chessData.error,
      //       };
      //       this.showData = false;
      //       this.showError = true;
      //       this.errorData = errorData;
      //     } 
      //     else {
      //       this.showData = true;
      //       this.showError = false;
      //       return this.chessData;
      //     } 
      //   } else return {pending: 'retrieving data...'}
      // }
    },
    methods: {
      filterKey(key) {
        return key.replace('_', ' ')
      },
      getUser() {
        this.userName = this.user;
      },
      getChessData() {
        let this1 = this;
        getChessAPIData(this.userName.trim())
        .then(function(result) {
          // console.log('then called?');
          if (result.error) {
            this1.errorData = result;
            this1.showError = true;
            this1.showData = false;
          } else {
            this1.chessData = result;
            this1.showError = false
            this1.showData = true;
          }
        })
        .then(function() {
          this1.sortChessData( )
        })
        .then(function() {
          this1.findLatestData()
        })
        .catch(function(error) { // do we even get here ever?
          this1.errorData = error
          console.log(this1.errorData);
        })
      },
      //for global access using "bluesky" variable
      retrieveLocalChessData() { 
        return this.chessData
      },
      retrieveInterval_a() { 
        return this.interval_a
      },
      //for global access using "bluesky" variable
      setLocalChessData(val) {
        this.chessData = val;
      },
      findLatestData() {
        let liTags = this.$refs.chessData,
            latestDateIndex = 0,
            latestUtcDate = 0,
            utcDate,
            liTarget,
            regx = /latest date: /gi;
        liTags.forEach(function(li, index) {
          if (li.innerText.match('latest date')) {
            let date = li.innerText.replace(regx, '');
            console.log(date)
            utcDate = convertToUTC(date);
            if (utcDate > latestUtcDate) {
              latestDateIndex = index;
              latestUtcDate = utcDate;
            }
          }
        })
        liTarget = liTags[latestDateIndex];
        liTarget.style.fontWeight = 'bolder';
        // console.log(liTarget.parentNode.parentNode);
      },
      sortChessData(evalKey = 'latest date') {
        let sortedChessData = sortObjectByKeys(this.chessData, evalKey);
        this.chessData = sortedChessData;
      }
    },
    created() {
      this.getUser()
      // this.getChessData()
      // this.sortChessData()
      // setTimeout(this.getChessData, Number(this.delay))
      // setTimeout(this.sortChessData, Number(this.delay) + 500)
      //defined in index.html:
      // bluesky.chessData = {}; 
      bluesky.chessData[this.userName] = this.retrieveLocalChessData;
      bluesky.interval_a = this.retrieveInterval_a;
      bluesky.chessDataSet = this.setLocalChessData;
      bluesky.findLatestData = this.findLatestData;
      // bluesky.chessDataSort = this.sortChessData;
    },
    mounted() {
      let this1 = this;
      this.$nextTick()
      .then(function() {
        this1.getChessData()
        // console.log('this1: ', this1);
        // console.log('getting chess data');
      })
      .then(function() {
        this1.interval_a = setInterval(this1.getChessData, 1000*60*3);
      })
    },
    beforeDestroy() {
      //this won't be called because our router is set to keep routes alive
      console.log('beforeDestroy() called');
    },
    deactivated() {
      console.log('interval_a was deactivated');
      clearInterval(this.interval_a)
      this.activated = false;
    },
    activated() {
      if (!this.activated) {
        this.interval_a = setInterval(this.getChessData, 1000*60*3)
        console.log('interval_a was reactivated');
      }
      this.activated = true;
    }
  }


</script>


<style scoped>

  /*
    green #779556
    cream #ebecd0
    piece center #575452
    piece shade #464342
    background #312e2b
  */

  main {
    display: flex;
    flex-direction: column;
    /* justify-content: end; */
    align-items: center;
    background-color: #312e2b;
    padding: 10px 0 5px 0;
  }

  label {
    color: #ebecd0;
  }

  input {
    background-color: #ebecd0;
    border: 1px solid #779556;
    margin-bottom: 10px;
    padding-left: 2px;
  }

  article {
    /* display: inline-block; */
    position: relative;
    text-align: center;
    width: 50%;
    min-width: 500px;
    /* border: 1px solid green; */
    margin-bottom: 5px;
    font-size: 1.2em;
    color: #ebecd0;
    background-color: #779556;
  }

  article span {
    position: absolute;
    top: 7px;
    left: 10px;
    font-size: 0.8em;
  }

  ul {
    width: 100%;
    list-style-type: none;
    padding-left: 0;
  }

  hr {
    width: 80%;
    color: #ebecd0;
    opacity: 0.5;
    margin: 5px auto;
  }

  .margin-top-10 {
    margin-top: 10px;
  }

  @media (max-width: 1070px) {
    #userDisplay {
      display: none;
    }
  }

  @media (max-width: 500px) {
    article {
      width: 100%;
      min-width: unset;
    }
  }


</style>