<template>
  <main>
    <!-- switched to using a prop -->
    <!-- <input type="text" autocomplete="on" v-model="username"  -->
    <input type="text" autocomplete="on" v-model="user" 
    v-on:keydown.enter="getChessData" />

    <article ref="chessGames" v-for="(game, index) in chessDataResult"
    v-bind:key="index" >
      <!-- <span>user: {{username}}</span> -->
      <span>user: {{user}}</span>
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
      //switched to using a prop:
      // username: 'knightofthedead', 
      interval_a: null
    }),
    props: {
      delay: String,
      user: String
    },
    computed: {
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
      getChessData() {
        let this1 = this;
        //switched to using a prop:
        // getChessAPIData(this.username)
        getChessAPIData(this.user)
        .then(function(result) {
          this1.chessData = result;
        })
        .then(function() {
          this1.sortChessData()
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
      // this.getChessData()
      // this.sortChessData()
      // setTimeout(this.getChessData, Number(this.delay))
      // setTimeout(this.sortChessData, Number(this.delay) + 500)
      //defined in index.html:
      // bluesky.chessData = {}; 
      bluesky.chessData[this.user] = this.retrieveLocalChessData;
      bluesky.chessDataSet = this.setLocalChessData;
      bluesky.findLatestData = this.findLatestData;
      bluesky.chessDataSort = this.sortChessData;
    },
    mounted() {
      let this1 = this;
      this.$nextTick()
      .then(function() {
        console.log('this1: ', this1);
        this1.interval_a = setInterval(this1.getChessData, 1000*60)
      })
      .then(function() {
        console.log('getting chess data');
        this1.getChessData()
      })
    },
    // beforeUpdate() {
    //   let this1 = this;
    //   this.$nextTick().then(function() {
    //     this1.findLatestData()
    //     // this1.sortChessData()
    //   })
    // },
    beforeDestroy() {
      //this won't be called because our router is set to keep routes alive
      console.log('beforeDestroy() called');
    },
    deactivated() {
      console.log('deactivated called!');
      clearInterval(this.interval_a)
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