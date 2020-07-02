<template>
  <v-container class="d-flex flex-column align-center">
  <!-- <v-container style="background-color: #eee" class="d-flex flex-column align-center"> -->
    <VuetifyLogIn/>
    <EmptyComponent/>
    <v-layout>
      <v-card class="mt-5 pa-3 elevation-6">
        <p>{{loginText}}</p> 
        <p>{{authInfo}}</p> 
        <hr>
        <p class="text-left">Username: {{userName}}</p>
        <p class="text-left">Email: {{userEmail}}</p>
        <p class="text-left">Uid: {{userId}}</p>
        <hr>
        <!-- 'test' here is a prop -->
        <p>{{test}}</p> 
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
  import VuetifyLogIn from '@/components/VuetifyLogIn';
  import EmptyComponent from '@/components/firebaseDatabase';
  import {auth} from '@/firebase_config.js';
  import {mapState} from 'vuex';

  export default {
    components: {
      VuetifyLogIn,
      EmptyComponent
    },
    props: {
      test: String
    },
    data: () => ({
      loginTextStatus: false,
      authInfo: '(auth info)'
    }),
    computed: {
      loginText() {
        let status;
        let text = {
          in: `logged in. Welcome!`,
          out: `logged out. Please log in.`
        };
        !!this.loginTextStatus ? 
        status = 'in':
        status = 'out'; 
        return `You are ${text[status]}`;
      },
      ...mapState({
        userName: state=>state.users.user.name,
        userEmail: state=>state.users.user.email,
        userId: state=>state.users.user.uid
      })
      // ...mapState('users', ['name'])
    },
    methods: {
      changeLoginTextStatus() {
        this.loginTextStatus = !this.loginTextStatus;
      }
    },
    activated() {
      console.log('keep-alive activated');

    }
  }
  console.log('LogIn module lazy-loaded via router')

</script>


<style scoped>
  /* not working because Vuetify styles are taking precedence: */
  p {
    text-align: center;
  }

  hr {
    margin-bottom: 5px;
  }

</style>