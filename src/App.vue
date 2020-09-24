<template>

  <v-app id="v-app">
    <v-app-bar app color="primary" dark class="width-100">
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
      
      <!-- <div class="router-links">
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
        :class="{deactivated: routerLink_home}">
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
        to="/chess" 
        tag="span" 
        tabindex="0"
        class="hover"
        :class="{deactivated: routerLink_chess}">
        Chess</router-link>
      </div> -->

      <div class="router-links desktop">
        <router-link v-for="(routerLink, i) in routerLinks"
        :key="routerLink.name"
        :to="routerLink.link" 
        tag="span" 
        tabindex="0"
        class="hover"
        :class="{deactivated: getDeactivatedStatus(routerLink.deactivated)}">
          <span>{{ routerLink.name }}</span>
          <span v-if="i < (routerLinks.length - 1)"> | </span>
        </router-link>
      </div>

      <div class="router-links mobile">
        <v-menu ref="linksMenu"
          :disabled="disabled"
          :absolute="absolute"
          :open-on-hover="openOnHover"
          :close-on-click="closeOnClick"
          :close-on-content-click="closeOnContentClick"
          :offset-x="offsetX"
          :offset-y="offsetY"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              v-bind="attrs"
              v-on="on"
            >
              Menu
            </v-btn>
          </template>

          <router-link v-for="(routerLink, i) in routerLinks"
          :key="routerLink.name"
          :to="routerLink.link" 
          tag="li" 
          tabindex="0"
          class="hover menu"
          :class="{deactivated: getDeactivatedStatus(routerLink.deactivated)}">
            <span>{{ routerLink.name }}</span>
            <hr v-if="i < (routerLinks.length - 1)">
          </router-link>
        </v-menu>
      </div>

      <SessionTime ref="session"/>

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
          <router-view v-on:changeRouterlinkName="changeRouterlinkName"
          ref="routerView"
          test="<router-view> prop test">
          </router-view>
        </keep-alive>
      </transition>

    </v-content>

  </v-app>

</template>


<script>

  import SessionTime from '@/components/SessionTime/SessionTime.vue';
  import PositionMonitor from '@/components/PositionMonitor.vue';
  import {mapState} from 'vuex';
  import eventHub from '@/eventHub.js';

  export default {
    name: 'App',
    components: {
      SessionTime,
      PositionMonitor
    },
    data: () => ({
      slotText: 'slot text from data',
      routerLinks: [
        {
        name: 'Login',
        link: '/login',
        deactivated: 'routerLink_login'
        },
        {
        name: 'Home',
        link: '/home',
        deactivated: 'routerLink_home'
        },
        {
        name: 'Blog Entry',
        link: '/blog_entry',
        deactivated: 'routerLink_blog_entry'
        },
        {
        name: 'Blog View',
        link: '/blog_view',
        deactivated: 'routerLink_blog_view'
        },
        {
        name: 'Canvas',
        link: '/canvas',
        deactivated: 'routerLink_canvas'
        },
        {
        name: 'Video1',
        link: '/video1',
        deactivated: 'routerLink_video1'
        },
        {
        name: 'Signin',
        link: '/signin',
        deactivated: 'routerLink_signin'
        },
        {
        name: 'Chess',
        link: '/chess',
        deactivated: 'routerLink_chess'
        }
      ],
      disabled: false,
      absolute: false,
      openOnHover: false,
      value: false,
      closeOnClick: true,
      closeOnContentClick: true,
      offsetX: false,
      offsetY: true,
    }),
    computed: mapState({
      displayNone: 'displayNone',
      routerLink_login: state => state.routerLinks.login,
      routerLink_home: state => state.routerLinks.home,
      routerLink_blog_entry: state => state.routerLinks.blog_entry,
      routerLink_blog_view: state => state.routerLinks.blog_view,
      routerLink_canvas: state => state.routerLinks.canvas,
      routerLink_video1: state => state.routerLinks.video1,
      routerLink_signin: state => state.routerLinks.signin,
      routerLink_chess: state => state.routerLinks.chess,
      loginText: state=>state.users.user.email,
      loginStatus: function(state) {
        let text;
        state.users.loginStatus ? 
        text = 'Logged in as: ':
        text = 'Please log in to use this application';
        return text
      }
    }),
    methods: {
      getDeactivatedStatus(entry) {
        // console.log(entry);
        return this[entry]
      },
      getDisplay() {
        console.log('getDisplay called!');
        return false
      },
      changeRouterlinkName(text) {
        this.routerLinks[0].name = text;
      },
      broccoli(text) {
        console.log(text)
      }
    },
    created() { 
      console.log('created!')
      // eventHub.$on('changeRouterlinkName', this.changeRouterlinkName)
    },
    mounted() { console.log('mounted!')},
    beforeUpdate() { console.log('beforeUpdate!')},
    updated() { console.log('updated!')},
  };

</script>


<style scoped>

  .content-body {
    margin-top: 10px;
  }

  .router-link-active span:first-child {
    text-decoration: underline;
    font-weight: bolder;
  }

  #login-text {
    margin-left: 20px;
    font-size: 0.8em;
  }

  .hover:hover {
    cursor: pointer;
  }

  .menu {
    list-style-type: none;
  }

  /* Vuetify */
  .v-menu__content {
    background-color: white;
    color: var(--button1);
    margin-top: 5px;
    padding: 5px 10px;
    text-align: center;
    line-height: 2;
  }

  /* Vuetify */
  .v-menu__content li:hover {
    background-color: #dedeff;
  }

  .deactivated {
    color: #999;
    pointer-events: none;
    cursor: unset;
  }

  .width-100 {
    width: 100vw;
  }

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
    transition-duration: 100ms;
  }

  .slide-leave-to {
    transform: translateX(100vw);
  }

  p {
    text-align: center;
  }

  /* undo Vuetify styling for <code> tag 
  ...NOT WORKING */
  /* .v-application code {
    all: unset;
  } */

  @media (min-width: 771px) {
    .mobile {
      display: none;
    }

    .v-menu__content {
      display: none;
    }

    .desktop {
      display: initial;
    }

    .router-links {
      width: 515px;
    }
  }

  @media (max-width: 770px) {
    .mobile {
      display: initial;
    }

    .desktop {
      display: none;
    }

    .router-links {
      width: unset;
    }
  }

  /*There are six classes applied for enter/leave transitions.

  v-enter: Starting state for enter. Added before element is inserted, removed one frame after element is inserted.

  v-enter-active: Active state for enter. Applied during the entire entering phase. Added before element is inserted, removed when transition/animation finishes. This class can be used to define the duration, delay and easing curve for the entering transition.

  v-enter-to: Only available in versions 2.1.8+. Ending state for enter. Added one frame after element is inserted (at the same time v-enter is removed), removed when transition/animation finishes.

  v-leave: Starting state for leave. Added immediately when a leaving transition is triggered, removed after one frame.

  v-leave-active: Active state for leave. Applied during the entire leaving phase. Added immediately when leave transition is triggered, removed when the transition/animation finishes. This class can be used to define the duration, delay and easing curve for the leaving transition.

  v-leave-to: Only available in versions 2.1.8+. Ending state for leave. Added one frame after a leaving transition is triggered (at the same time v-leave is removed), removed when the transition/animation finishes./*/


</style>