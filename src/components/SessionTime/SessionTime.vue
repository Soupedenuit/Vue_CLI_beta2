<template>
  <div>
    <span id="session-time" v-bind:class="{'translateY-slider': translateY}">
      {{beta}}<br/>{{alpha}}
    </span>
 
    <!-- session time button -->
    <button 
    tabindex="0" 
    v-on:click="openSessionTime" 
    v-bind:disabled=disabled >
      <svg id="session-time-btn-svg-used" width="38" height="38" viewBox="1 1 22 22" >
        <use xlink:href="#use"></use>
      </svg>
    </button>

    <svg id="session-time-btn-svg" class="display-none">
      <defs>
        <g id="use">
          <path id="session-time-btn-svg-path1" d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />
        </g>
      </defs>
    </svg>
  </div>

</template>

<script>
import {sessionTime, displayTimeOpened} from './time_related_functions'

export default {
  name: 'SessionTime',
  data: function () {
    return {
      alpha: 'session opened!',
      beta: '',
      disabled: false,
      hours: null, // enter hour or undefined/null
      minutes: null, // enter minute or undefined/null
      // actionStatus: true,
      translateY: false
    }
  },
  methods: {
    session: function() {
      this.alpha = sessionTime(this.hours,this.minutes)
    },
    openSessionTime() {
      this.translateY = !this.translateY;
    }
  },
  mounted() {
    this.interval = setInterval(this.session, 1000);
    this.beta = displayTimeOpened(this.hours,this.minutes);
  }
}

</script>

<style scoped>

/* :root {
  color: #2c3e50;
  fill: #2c3e50;
} */

#session-time {
  position: fixed;
  /* z-index: 3; */
  font-size: 0.8em;
  width: 240px;
  margin: 0;
  top: -40px; /* height minus 10px */
  right: 10px;
  color: var(--button1); /* #1867c0; */
  -webkit-transition: -webkit-transform 0.3s ease;
     -moz-transition: -moz-transform 0.3s ease;
      -ms-transition: -ms-transform 0.3s ease;
       -o-transition: -o-transform 0.3s ease;
          transition: transform 0.3s ease;
}

.translateY-slider {
  -webkit-transform: translateY(112px);
     -moz-transform: translateY(112px); 
      -ms-transform: translateY(112px); 
       -o-transform: translateY(112px); 
          transform: translateY(112px);
}

button {
  /* position: fixed;
  top: 70px;
  right: 12px;
  z-index: 1; */
  position: relative;
  top: 3px;
  margin-left: 30px;
}

button:focus {
  outline: 1px var(--button1) solid;
}

#session-time-btn-svg-used:hover {
  transform: scale(1.1);
}

#session-time-btn-svg-path1 {
  fill: #fff;
}

</style>