<template>
  <main>
    <input type="text" autocomplete="on" v-model="username" 
    v-on:keydown.enter="getChessData" />

    <article ref="chessGames" v-for="(game, index) in chessDataResult"
    v-bind:key="index" >
      <span>user: {{username}}</span>
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
  import {nextTick} from 'vue';

  export default {
    name: 'Chess',
    data: () => ({
      chessData: null,
      showData: false,
      showError: true,
      username: 'knightofthedead',
      interval_a: null
    }),
    computed: {
      chessDataResult() {
        if (this.chessData) {
          if (this.chessData.error) {
            let errorMessage = {
              statusCode: this.chessData.statusCode,
              test: 'yoyo'
            }
            this.showData = false;
            this.showError = true;
            // return errorMessage;
            return this.chessData;
          } else {
              this.showData = true;
              this.showError = false;
              return this.chessData;
          } 
        } else return {error: 'data not retrieved'}
      }
    },
    methods: {
      getChessData() {
        let this1 = this;
        getChessAPIData(this.username)
        .then(function(result) {
          this1.chessData = result;
        })
        //this doesn't do anything, as getChessAPIData() always returns either a result or an error
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
        // let chessGames = this.$refs.chessGames;
        // let liTags = document.getElementsByTagName('li');
        let liTags = this.$refs.chessData;
        let latestDateIndex = 0;
        let latestUtcDate = 0;
        let utcDate;
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
        liTags[latestDateIndex].style.fontWeight = 'bolder';
      }
    },
    created() {
      this.getChessData()
      bluesky.chessData = this.retrieveLocalChessData;
      bluesky.chessDataSet = this.setLocalChessData;
      bluesky.findLatestData = this.findLatestData;
    },
    mounted() {
      let this1 = this;
      this.$nextTick().then(function() {
        // this1.interval_a = setInterval(this1.getChessData, 1000*60)
        // console.log('this: ', this);
        console.log('this1: ', this1);
        this1.interval_a = setInterval(function() {
          this1.getChessData()
          console.log('interval_a');
        }, 1000*10)
      })
    },
    beforeUpdate() {
      let this1 = this;
      this.$nextTick().then(function() {
        this1.findLatestData()
      })
    },
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