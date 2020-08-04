<template>
  <main>
    <!-- switched to using a prop -->
    <!-- <input type="text" autocomplete="on" v-model="username"  -->
    <form action="" method="" autocomplete="on">
      <label for="userNameInput">Username: </label>
      <input name="userNameInput" type="text" autocomplete="on" 
      v-model="userName" 
      v-on:keydown.enter.prevent="getChessData">
      <!-- <select name="userName" id="user-name" v-on:keydown.enter.prevent="getChessData">
        <option value="knightofthedead">knightofthedead</option>
        <option value="sstoehr">sstoehr</option>
      </select> -->
    </form>

    <article ref="chessGames" v-for="(game, index) in chessDataResult"
    v-bind:key="index" >
      <span>user: {{userName}}</span>
      <h2>{{ index }}</h2>
      <ul v-if="showData">
        <li ref="chessData" v-for="(stat, index) in game"
        v-bind:key="index" >
        {{ index }}: {{ stat }}
        </li>
      </ul>
      <p v-if="showError">
        {{game}}
      </p>
    </article>
  </main>

</template>


<script>
  import getChessAPIData from './Chess.com_API.js';
  import {convertToUTC} from '@/dateConverter.js';
  import {sortObjectByKeys} from '@/object_sort.js';
  import {nextTick} from 'vue';

  export default {
    name: 'Chess',
    data: () => ({
      chessData: null,
      showData: false,
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
      // userName: {
      //   get() {
      //     return this.user
      //   },
      //   set(val) {
      //     this.user = val
      //   }
      // },
      chessDataResult() {
        if (this.chessData) {
          //this doesn't do anything, as getChessAPIData() always returns a result or an error, and this.chessData will be this result or error - see **
          if (this.chessData.error) {
            let errorMessage = {
              statusCode: this.chessData.statusCode,
              test: 'yoyo'
            }
            this.showData = false;
            this.showError = true;
            // return errorMessage;
            return this.chessData;
          } 
          // ** it will always be else here:
          else {
              this.showData = true;
              this.showError = false;
              return this.chessData;
          } 
        } else return {pending: 'data being retrieved...'}
      }
    },
    methods: {
      getUser() {
        this.userName = this.user;
      },
      getChessData() {
        let this1 = this;
        //switched to using a prop:
        getChessAPIData(this.userName)
        .then(function(result) {
          this1.chessData = result;
        })
        .then(function() {
          this1.sortChessData( )
        })
        .then(function() {
          this1.findLatestData()
        })
        //this doesn't do anything, as getChessAPIData() always returns (a result or an error)
        .catch(function(error) {
          this1.chessData = error
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
        let liTags = this.$refs.chessData;
        let latestDateIndex = 0;
        let latestUtcDate = 0;
        let utcDate;
        let liTarget;
        let regx = /latestDate: /gi;
        liTags.forEach(function(li, index) {
          if (li.innerText.match('latestDate')) {
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
      sortChessData(evalKey = 'latestDate') {
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
      bluesky.chessDataSort = this.sortChessData;
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
        this1.interval_a = setInterval(this1.getChessData, 1000*60*5);
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
        this.interval_a = setInterval(this.getChessData, 1000*60*5)
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
    border: 1px solid green;
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


</style>