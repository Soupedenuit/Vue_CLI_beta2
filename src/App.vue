<template>

  <v-app id="v-app">
    <v-app-bar app color="primary" dark >
      <div class="d-flex align-center">
        <v-img
          alt="Vuetify Logo"
          class="shrink mr-2"
          contain
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-logo-dark.png"
          transition="scale-transition"
          width="40"
        />

        <v-img
          alt="Vuetify Name"
          class="shrink mt-1 hidden-sm-and-down"
          contain
          min-width="100"
          src="https://cdn.vuetifyjs.com/images/logos/vuetify-name-dark.png"
          width="100"
        />
      </div>

      <span id="login-text" class="align-self-end">
        {{loginStatus}}{{loginText}}
      </span>

      <v-spacer></v-spacer>
      
      <div class="router-links">
        <router-link 
        to="/login" 
        tag="span" 
        tabindex="0"
        class="hover"
        :class="{deactivated: routerLink_login}">
        Login</router-link> | 
        <router-link 
        to="/home" 
        tag="span"
        tabindex="0"
        class="hover" 
        :class="{deactivated: routerLinkHome}">
        Home</router-link> | 
        <router-link 
        :to="{name: 'blog_entry'}" 
        tag="span" 
        tabindex="0"
        class="hover"
        :class="{deactivated: routerLink_blog_entry}">
        Blog Entry</router-link> | 
        <router-link 
        :to="{name: 'blog_view'}" 
        tag="span" 
        tabindex="0"
        class="hover"
        :class="{deactivated: routerLink_blog_view}">
        Blog View</router-link> | 
        <router-link 
        to="/canvas" 
        tag="span" 
        tabindex="0"
        class="hover"
        :class="{deactivated: routerLink_canvas}">
        Canvas</router-link> | 
        <router-link 
        to="/video1" 
        tag="span" 
        tabindex="0"
        class="hover"
        :class="{deactivated: routerLink_video1}">
        Video1</router-link> | 
        <router-link 
        to="/signin" 
        tag="span" 
        tabindex="0"
        class="hover"
        :class="{deactivated: routerLink_signin}">
        Signin</router-link> | 
        <router-link 
        to="/pdf1" 
        tag="span" 
        tabindex="0"
        class="hover"
        :class="{deactivated: routerLink_pdf1}">
        PDF</router-link>
      </div>

      <!-- <v-spacer></v-spacer> -->

      <SessionTime ref="session"/>
      <!-- <v-btn
        href="https://github.com/vuetifyjs/vuetify/releases/latest"
        target="_blank"
        text
      >
        <span class="mr-2">Latest Release</span>
        <v-icon>mdi-open-in-new</v-icon>
      </v-btn> -->
    </v-app-bar>


    <v-content class="content-body d-flex flex-column align-top width-100" id="content">

      <PositionMonitor v-bind:class="{'display-none': displayNone}">
        <template v-slot:namedSlot>
          <p>Named slot text here</p>
        </template>
        <p><u>slot 1 paragraph</u></p>
        <p><ins>slot 2 paragraph</ins></p>
        <p>{{slotText}}</p>
      </PositionMonitor>

      <transition name="slide" mode="out-in">
        <keep-alive>
          <router-view test="<router-view> prop test" ref="routerView"></router-view>
        </keep-alive>
      </transition>

    </v-content>

  </v-app>

</template>


<script>

  import SessionTime from '@/components/SessionTime/SessionTime.vue';
  import PositionMonitor from '@/components/PositionMonitor.vue';
  import {mapState} from 'vuex'

  export default {
    name: 'App',
    components: {
      SessionTime,
      PositionMonitor
      // HelloWorld
    },
    data: () => ({
      slotText: 'slot text from data'
    }),
    computed: mapState({
      displayNone: 'displayNone',
      routerLink_login: state => state.routerLinks.login,
      routerLinkHome: state => state.routerLinks.home,
      routerLink_blog_entry: state => state.routerLinks.blog_entry,
      routerLink_blog_view: state => state.routerLinks.blog_view,
      routerLink_canvas: state => state.routerLinks.canvas,
      routerLink_video1: state => state.routerLinks.video1,
      routerLink_signin: state => state.routerLinks.signin,
      routerLink_pdf1: state => state.routerLinks.pdf1,
      loginText: state=>state.users.user.email,
      loginStatus: function(state) {
        let text;
        state.users.loginStatus ? 
        text = 'Logged in as: ':
        text = 'Please log in to use this application';
        return text
      }
    })
  };

</script>


<style scoped>

  .content-body {
    margin-top: 10px;
  }

  .router-links {
    width: 500px;
  }

  .router-link-active {
    text-decoration: underline;
  }

  #login-text {
    margin-left: 20px;
    font-size: 0.8em;
  }

  .hover:hover {
    cursor: pointer;
  }

  .deactivated {
    color: #999;
  }

  .deactivated:hover {
    cursor: unset;
  }

  .width-100 {
    width: 100vw;
  }

  /*There are six classes applied for enter/leave transitions.

  v-enter: Starting state for enter. Added before element is inserted, removed one frame after element is inserted.

  v-enter-active: Active state for enter. Applied during the entire entering phase. Added before element is inserted, removed when transition/animation finishes. This class can be used to define the duration, delay and easing curve for the entering transition.

  v-enter-to: Only available in versions 2.1.8+. Ending state for enter. Added one frame after element is inserted (at the same time v-enter is removed), removed when transition/animation finishes.

  v-leave: Starting state for leave. Added immediately when a leaving transition is triggered, removed after one frame.

  v-leave-active: Active state for leave. Applied during the entire leaving phase. Added immediately when leave transition is triggered, removed when the transition/animation finishes. This class can be used to define the duration, delay and easing curve for the leaving transition.

  v-leave-to: Only available in versions 2.1.8+. Ending state for leave. Added one frame after a leaving transition is triggered (at the same time v-leave is removed), removed when the transition/animation finishes.*/

  .slide-enter {
    transition-delay: 0ms;
    transform: translateX(-100vw);
  }

  /* .slide-enter-active {
    transform: translateX(-100vw);
  } */

  .slide-enter-to {
    transform: translateX(0);
  }

  .slide-enter-active, .slide-leave-active {
    transition-property: transform;
    transition-duration: 200ms;
  }

  .slide-leave-to {
    transform: translateX(100vw);
  }

  p {
    text-align: center;
  }

  /* undo Vuetify styling for <code> tag 
  ...NOT WORKING */
  .v-application code {
    all: unset;
  }


</style>