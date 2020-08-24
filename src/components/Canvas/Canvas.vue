<template>

  <div ref="canvas1" id="canvas-container">

    <h1>Canvas with GSAP animations</h1>

    <canvas ref="canvas_ref" id="canvas" width="800" height="800">
    </canvas>

    <div id="form-container">

      <form id="canvas-form" action="">
        <label for="canvas-input">enter canvas actions:
          <textarea id="canvas-input" rows="6S" type="text" name="canvas-input" ></textarea>
        </label>
      </form>

    </div>

  </div>

</template>


<script>

  import {canvas_module, canvas_module_data} from './canvas.js';
  import addCentreDot from './add_centre_dot.js';

  export default {
    name: 'Canvas',
    data: function() {
      return {
        canvas_test: 'canvas data'
      }
    },
    computed: {
      canvasModuleData: function () {
        return canvas_module_data
      },
    },
    methods: {
      getWindowWidth: function() {
        let ww = window.innerWidth + 'px';
        console.log(ww);
        this.$store.dispatch('postWindowWidth', ww);
        return ww
      },
      // Edge does not provide properties x or y on 
      // window.getBoundingClientRect() object
      canvasPositionX: function() {
        let target = this.$refs.canvas_ref;
        // console.log(target.getBoundingClientRect());
        let pos = target.getBoundingClientRect().x || target.getBoundingClientRect().left;
        let pos_x = pos.toFixed() + 'px';
        this.$store.dispatch('updateCanvasPosition', pos_x);
        return pos_x
      },
      observeCanvasPosition: function() {
        console.log('observeCanvasPosition method read');
        const observer = 
        new IntersectionObserver(entries => 
          this.canvasPositionX()
        );
        let options = {
          root: null,
          rootMargin: '0px',
          threshold: 1.0
        };
        observer.observe(this.$refs.canvas_ref)
      }
    },
    created() {
      console.log('canvas created');
    },
    mounted() {
      this.$nextTick(function() {
        let this1 = this;
        console.log('Canvas.vue mounted');
        // console.log(this.$data);
        // console.log(this.$refs.canvas1);
        console.log(this1);
        addCentreDot(this.$refs.canvas1)
        .then(function(elements) {
          console.log('canvas_module called');
          // console.log(this1);
          canvas_module(elements)
        })
        .then(this1.getWindowWidth)
        .then(function() {
          console.log('beforeMount call observeCanvasPosition');
          this1.observeCanvasPosition()
        })
        .catch(function(error) {
          console.log('Error: ', error)
          reject(error)
        })
      })
    },
    watch: {
    }
  }

</script>


<style scoped>

  #canvas-container {
    position: relative;
    padding: 0;
    margin: 0;
    /* height: 100%; */
    /* width: calc(100vw - 17px); */
    height: 1100px;
    /* width: 100vw; */
    background-color: rgb(50, 50, 50);
    color: var(--color1);
    font-family: 'Open Sans', 'Poiret One';
    /* overflow-y: scroll; */
  }

  h1 {
    text-align: center;
    margin: 5px;
  }

  #canvas {
    width: 800px;
    height: 800px;
    margin-left: 50%;
    transform: translateX(-50%);
    background-color: var(--backg3);
    border: 1px solid var(--color1);
  }

  #form-container {
    position: relative;
    /* height: 75px; */
    width: 100vw;
    /* background-color: rgb(50, 50, 50); */
    margin: 0;
    /* background-color: mediumpurple; */
  }

  form {
    /* display: flex; */
    position: absolute;
    width: 300px;
    /* height: 75px; */
    /* position: fixed; */
    /* bottom: 50px; */
    left: 50%;
    transform: translateX(-50%);
    /* flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start; */
  }

  label, textarea {
    width: 300px;
  }

  textarea {
    background-color: var(--color1);
    color: black;
    padding-left: 1em;
  }

  label {
    display: block; /* cannot center label without block */
    text-align: center;
    padding: 0;
    margin: 0;
  }

  /* HSLA not working on current version of Edge (44): use HSL instead (see what happens in Edge) */
  @supports not (color: hsla(212, 38%, 80%)) {

    #canvas-container {
      color: blue;
    }
      
    #canvas {
      background-color: khaki;
      border: 1px solid goldenrod;
    }

    textarea {
      background-color: bisque;
    }

  }

</style>