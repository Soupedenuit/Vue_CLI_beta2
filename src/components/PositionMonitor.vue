<template>
  <div id="position-monitor" class="container" ref="container" v-on:click="resetPositions">
    <p>{{position}}</p>
    <!-- slot practice only: -->
    <slot>default text</slot>
    <slot name="namedSlot"></slot>
  </div>
</template>


<script>

  import {mapState} from 'vuex'

  export default {
    name: 'PositionMonitor',
    data: function() {
      return {
        // position: 'position test'
      }
    },
    computed: mapState({
      // position: state => state.canvasPositionX.slice(-1)[0]
      position: function(state) {
        let target = state.canvasPositionX;
        if (target.length > 0) {
          return target.join(', ');
        } else return 'not computed';
      },
    }),
    methods: mapState({
      resetPositions: function(state) {
        this.$store.dispatch('resetCanvasPositions')
      }
    }),
    // watch: {
    //   position: function(val, oldVal) {
    //     console.log(val);
    //     console.log(oldVal);
    //   }
    // },
    created() {
      this.unwatch = this.$store.watch(
      (state, getters) => state,
      (newValue, oldValue) => {
        console.log(`Updating from ${oldValue} to ${newValue}`);
      })
    },
    mounted() {
      let this1 = this;
      const MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;
      let observer = new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          console.log('mutationObserver activated:')
          this1.$refs.container.style.width = '1000px';
          let alpha = window.getComputedStyle(this1.$refs.container.firstChild);
          this1.$refs.container.style.width = Number(alpha.width.slice(0,alpha.width.length-2) + 30) + 'px';
        })
      });
      // observer.observe(this1.$refs.container, {
      //   characterData: true,
      //   subtree: true
      //   })        
    }
  }

</script>


<style scoped>

  /* Stack Overflow (user jiggunjer): fit-content uses max-content, unless available < max-content, then it uses available. Unless available < min-content, then it uses min-content. (Feature not working in IE/Edge) */

  .container {
    /* display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; */
    /* position: relative;
    top: 70px;
    left: 10px; */
    font-weight: bold;
    color: darkblue;
    background-color: coral;
    border: 1px solid black;
    width: 100%;
    width: fit-content; /* not working in Edge
    /* max-width: max-content; */
    /* height: 50px; */
    height: fit-content;
    margin-bottom: 10px;
    padding: 10px;
    cursor: pointer;
    /* box-sizing: border-box; */
  }

  p {
    text-align: center;
    /* display: inline-block; */
    font-size: 1.2em;
    background-color: rgb(205, 157, 245);
    /* width: fit-content; */ /* not working in Edge */
    /* width: max-content; */
    /* max-width: max-content; */
    /* height: 12px; */
    /* white-space: nowrap; */
    /* text-overflow: hidden; */
  }

</style>