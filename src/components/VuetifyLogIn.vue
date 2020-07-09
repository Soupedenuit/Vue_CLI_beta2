<template>
  <!-- <v-app id="inspire"> -->
    <v-container class="container fill-height" fluid>
      <!-- <v-row align="center" justify="center" > -->
        <!-- <v-col cols="12" sm="8" md="4" > -->
          <v-layout align-center>
            <v-flex>
              <v-card class="elevation-6">
                <v-toolbar color="primary" dark flat>
                  <v-toolbar-title>Login form</v-toolbar-title>
                  <v-spacer />
                  <!-- <v-tooltip bottom>
                    <template v-slot:activator="{ on }">
                      <v-btn :href="source" icon large target="_blank" v-on="on" >
                        <v-icon>mdi-code-tags</v-icon>
                      </v-btn>
                    </template>
                    <span>Source</span>
                  </v-tooltip> -->
                  <v-tooltip right>
                    <template v-slot:activator="{ on }">
                      <v-btn icon large href="https://codepen.io/johnjleider/pen/pMvGQO" target="_blank" v-on="on" >
                        <v-icon>mdi-codepen</v-icon>
                      </v-btn>
                    </template>
                    <span>Codepen</span>
                  </v-tooltip>
                </v-toolbar>
                <v-card-text>
                  <v-form>
                    <v-text-field v-model="emailText" label="Login" name="login" autocomplete="username" prepend-icon="" type="text" />
                    <v-text-field id="password" v-model="passwordText" label="Password" name="password" autocomplete="current-password" prepend-icon="" type="password" v-on:keydown.enter.prevent="login_logout"/>
                  </v-form>
                </v-card-text>
                <v-card-actions>
                  <v-spacer />
                  <v-btn color="primary" v-on:click="login_logout">{{loginBtnText}}</v-btn>
                </v-card-actions>
              </v-card>
            </v-flex>
          </v-layout>
        <!-- </v-col> -->
      <!-- </v-row> -->
    </v-container>
  <!-- </v-app> -->
</template>


<script>

  import {auth, database} from "@/firebase_config.js";
  import eventHub from '@/eventHub.js';
  import {getInitialState} from '@/initialState.js';
  import {toggleRouterLinks} from '../router/router';

  auth.setPersistence(firebase.auth.Auth.Persistence.NONE);

  function setInitialData() {
    return {
      emailText: 'igsu@rogers.com',
      passwordText: '', 
      loginStatus: false
    }
  }

  export default {
    data: () => (
      // emailText: '',
      // passwordText: '',
      // loginStatus: false
      setInitialData()
    ),
    props: {
      parentData: String
    },
    computed: {
      loginBtnText() {
        if (this.loginStatus) {
          return 'Log out';
        } else {
          return 'Log in';
        }
      }
    },
    methods: {
      resetData() {
        Object.assign(this.$data, setInitialData())
      },
      changeLoginStatus() {
        this.loginStatus = !this.loginStatus;
      },
      clearLoginForm() {
        this.emailText = '';
        this.passwordText = '';
      },
      setBlogArticle(text) {
        this.$store.dispatch('populateBlogArticle', text)
      },
      login_logout() {
        console.log(this.loginStatus);
        const routerView = vm_beta2.$children[0].$refs.routerView;
        if (!this.loginStatus) {
          let email = this.emailText.trim();
          let password = this.passwordText.trim();
          // returns promise:
          auth.signInWithEmailAndPassword(email, password)
          .then(()=> {
            this.$store.dispatch('updateUser', {
              name: auth.currentUser.displayName,
              email: auth.currentUser.email,
              uid: auth.currentUser.uid
              })
          })
          .then(()=> {
            routerView.loginTextStatus = !routerView.loginTextStatus })
          .then(this.clearLoginForm)
          .then(this.changeLoginStatus)
          .then(()=> {this.setBlogArticle('<p>fetched text for article</p>')})
          // .then(()=> readDatabase(auth.currentUser.uid, 'login'))
          .then(()=> eventHub.$emit('readDatabase', {uid: auth.currentUser.uid, uidChange: 'login'}))
          // .then(()=> {this.$router.push({name: 'blog'})})
          .then(()=>routerView.authInfo = 'sign in successful!')
          .then(()=> this.$store.dispatch('updateLoginStatus', true))
          .then(()=> toggleRouterLinks('loggedIn'))
          .catch(function(err) {
            console.log(err);
            // console.log(err.message);
            // console.log(err.name);
            // console.log(err.fileName); //Mozilla only
            // console.log(err.lineNumber); //Mozilla only
            // console.log(err.toString());
            routerView.authInfo = `sign in error: ${err.message}`;
          });
        } else {
          eventHub.$emit('readDatabase', {uid: auth.currentUser.uid, uidChange: 'logout'})
          // returns promise:
          auth.signOut()
          .then(()=> console.log('signed out'))
          .then(this.resetData)
          .then(()=> {
            routerView.loginTextStatus = !routerView.loginTextStatus })
          .then(()=> {
            routerView.authInfo = '(auth info)';
          })
          // .then(()=> {this.setBlogArticle('article deleted after logout!')})
          .then(()=> this.$store.dispatch('populateBlogArticle', 'logout'))
          .then(()=> this.$store.dispatch('resetState', this.$initialState.users))
          .then(()=> this.$store.dispatch('updateLoginStatus', false))
          .then(toggleRouterLinks)
          // .then(()=> eventHub.$emit('readDatabase', {uid: null, uidChange: 'logout'}))
          // .then(()=> {this.$router.push({name: 'blog'})})
          .catch(function(err) {
            console.log(err);
            routerView.authUID = `logout error: ${err.message}`;
          });
        }
      },
    }
  }

</script>


<style scoped>
  .container {
    width: 900px;
  }

</style>