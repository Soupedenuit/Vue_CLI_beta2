<template>
  <main>
    <!-- switched to using a prop -->
    <!-- <input type="text" autocomplete="on" v-model="username"  -->
    <form action="">
      <label for="userNameInput">Username: </label>
      <input ref="userNameInput" id="userNameInput" name="userNameInput" type="text" autocomplete="off" 
      spellcheck="false"
      v-model="userName" 
      @click="showNames = !showNames"
      @keydown.enter.prevent="getChessData('addUser')">
      <span v-show="showNames" id="userNames">
        <ul>
          <li class="hover-dark" 
          v-for="name in userNames" 
          :key="name"
          @click="selectName(name)">
            {{name}}
          </li>
        </ul>
      </span>
      <!-- <select name="userName" id="user-name" v-on:keydown.enter.prevent="getChessData">
        <option value="knightofthedead">knightofthedead</option>
      </select> -->
    </form>

    <article ref="chessGames" v-if="showData">
      <span id="userDisplay">user: {{displayedUserName}}
        <br>
        <img v-if="userAvatar" :src="userAvatar" :alt="altAvatarText" width="100">
        <p v-if="!userAvatar" class="small">(no user avatar)</p>
      </span>

      <section v-for="(game, key, index) in chessData"
      v-bind:key="key">
        <!-- <h2>{{filterKey(key)}}</h2> -->
        <h2>{{key.replace('_', ' ')}}</h2>
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
  import {getChessAPIData, getChessAPIUserAvatar} from './Chess.com_no_lib.js';
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
      userName: null,
      userNames: new Set([
        'knightofthedead',
        'sstoehr',
      ]),
      // localStorageUserNames: null,
      showNames: false,
      userAvatar: null,
      altAvatarText: 'user avatar',
      displayedUserName: ''
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
      selectName(name) {
        this.userName = name;
        this.showNames = false;
        this.$refs.userNameInput.focus()
      },
      addNameToUserNames() {
        this.userNames.add(this.userName)
      },
      // only called on mounted()
      getLocalStorageUserNames() {
        let storedString = window.localStorage.getItem('chessUserNames');
        let currentNames = Array.from(this.userNames);
        if (storedString) {
          let storedNames = JSON.parse(storedString).names;
          console.log('storedNames: ', storedNames);
          this.userNames = new Set(currentNames.concat(storedNames))
        } 
      },
      // called when username entered in input field
      setLocalStorageUserNames() {
        console.log('called setLocalStorageUserNames()');
        let currentNames = Array.from(this.userNames);
        let storeObj = JSON.stringify({names: currentNames});
        window.localStorage.setItem('chessUserNames', storeObj);
      },
      getUser() {
        this.userName = this.user.trim();
      },
      displayUserName(userName) {
        this.displayedUserName = this.userName;
      },
      getUserAvatar() {
        let _this = this;
        getChessAPIUserAvatar(this.userName)
        .then(function(avatar) {
          _this.userAvatar = avatar;
          // the following is now redundant since we are using v-if for img tag
          // avatar ? 
          // _this.altAvatarText = 'user avatar':
          // _this.altAvatarText = '(no user avatar)';
        })
        .catch((error) => _this.altAvatarText = error)
      },
      getChessData(addUser) {
        if (addUser) {
          this.addNameToUserNames()
          this.setLocalStorageUserNames()
        }
        let _this = this;
        getChessAPIData(this.userName)
        .then(function(result) {
          if (result.error) {
            _this.errorData = result;
            _this.showError = true;
            _this.showData = false;
          } else {
            _this.chessData = result;
            _this.showError = false
            _this.showData = true;
          }
        })
        .then(_this.displayUserName)
        .then(_this.getUserAvatar)
        .then(_this.sortChessData)
        .then(_this.findLatestData)
        .catch(function(error) { // do we even get here ever?
          _this.errorData = error
          console.log(_this.errorData);
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
        let 
          liTags = this.$refs.chessData,
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
      let _this = this;
      this.$nextTick()
      .then(function() {
        _this.getChessData()
        _this.getLocalStorageUserNames()
        // console.log('_this: ', _this);
        // console.log('getting chess data');
      })
      .then(function() {
        _this.interval_a = setInterval(_this.getChessData, 1000*60*3);
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

  form {
    position: relative;
  }

  label {
    color: #ebecd0;
  }

  input {
    background-color: #ebecd0;
    border: 1px solid #779556;
    margin-bottom: 10px;
    padding-left: 5px;
  }

  #userNames {
    position: absolute;
    top: 30px;
    left: 0;
    width: 100%;
    background-color: #ebecd0;
    border: 1px solid #312e2b;
    border-radius: 3px;
    z-index: 1;
  }

  .hover-dark {
    padding-left: 5px;
  }

  .hover-dark:hover {
    background-color: hsl(60, 19%, 73%);
    cursor:pointer;
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
    text-align: left;
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

  .small {
    font-size: .8em;
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