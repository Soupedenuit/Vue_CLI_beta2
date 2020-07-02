/**************************************
 ***************************************
 **  AUTHOR:  Tony Whomever
 **   PLACE:  Ottawa, ON, Canada
 ** PROJECT:  xx
 **    DATE:  Feb 2020
 ** VERSION:  1.00
 ** Copyright (C) 2020
 ***************************************
 **************************************/

// import {dot, dotContainer} from './add_centre_dot.js';

import _debounce from 'lodash/debounce'

let canvas_module_data;

const canvas_module = function(elements) {

  console.log('canvas_module loaded');
  
  let [dot, dotContainer] = elements;

  const DOM = {
    canvas: document.getElementById('canvas'),
    draw: canvas.getContext('2d'),
    input: document.getElementById('canvas-input'),
    textarea: document.querySelector('textarea')
  };

  let windowWidth = window.innerWidth;

  let canvasPosition = {
    x: DOM.canvas.getBoundingClientRect().left + windowWidth,
    y: DOM.canvas.getBoundingClientRect().top,
  };

  function adjustCanvasPosition(diffX) {
    console.log('adj canvas pos');
    console.log(diffX + 'px');
    canvasPosition.x += (diffX / 2) 
  }

  window.addEventListener('resize', _debounce(function() {
    console.log('window resized');
    let newWindowWidth = window.innerWidth;
    let diffX = newWindowWidth - windowWidth;
    windowWidth = newWindowWidth;
    adjustCanvasPosition(diffX)
  }, 1500/* , {leading: false, trailing: false} */))

  console.log(`canvasPosition: ${canvasPosition.x},${canvasPosition.y}`)
  

  let colours = ['#333', '#666', "#999", '#bbb', '#ddd', '#fff'];

  let state = {
    dotPosition: {},
    drawCount: 0,
    moveTo: true,
    replayCount: 0,
    started: false,
    timelinePlayed: false,
  };

  let timeline;
  let animateRequest;

  let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
  window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
  
  let cancelAnimationFrame = window.cancelAnimationFrame || window.mozCancelAnimationFrame;

  function cancelAnimation() {
    cancelAnimationFrame(animateRequest)
    console.log('requested animation cancelled')
  }
  
  // textarea functionality
  function drawOnCanvas(code) {
    let lines = code.split('\n');
    console.log('lines: ', lines);
    for (let line of lines) {
      let ln = line.trim();
      let index1 = ln.indexOf('(');
      let index2 = ln.indexOf(')');
      let method = ln.substring(0, index1)
      console.log('method: ', method);
      let args = ln.substring(index1 + 1, index2);
      let cleanData;
      if (args) {
        let rawData = args.split(',');
        console.log('rawData: ', rawData);
        cleanData = rawData.map(function(x) {
          if (x == 0) {
            return 0
          } else return eval(x.trim())
        }).filter(x => typeof x === 'number');
        console.log('cleanData: ',cleanData);
      }
      cleanData ? DOM.draw[method](...cleanData) : DOM.draw[method]();
    };
  }

  let default_textarea_code = [
    'moveTo(100,150 * 1.5)',
    'lineTo(200 * 2,200) ',
    'stroke()',
    'beginPath()',
    'arc(100, 75, 50, 0, 2 * Math.PI)',
    'stroke()'
  ];

  (function addCodeToTextarea(code) {
    DOM.textarea.value = code.join('\n')
  })(default_textarea_code)

  // addCodeToTextarea(default_textarea_code)

  DOM.input.addEventListener('keydown', function(event) {
    if (event.key === 'Control' /* && event.key === 'Enter' */) {
      // console.log(event);
      // console.log(event.keyCode);
      // event.preventDefault();
      let code = event.target.value;
      drawOnCanvas(code)
    }
  });

  // Disables right-click contextMenu. Does not work on click events, only on mouse events
  DOM.canvas.addEventListener('mousedown', function(event) {
    event.target.oncontextmenu = function() {
      return false; 
    };
  });

  // Alternative to above
  // DOM.canvas.addEventListener('contextmenu', function(event) {
  //   event.preventDefault();
  // });
  
  // calls animateDot()
  DOM.canvas.addEventListener('click', function(event) {
    if (event.button == 0) {
      console.log('animateDot() called');
      animateDot()
    } else if (event.button == 2) {
      // event.preventDefault()
      console.log('right click action');
    } else null
  });
  
  function animateDot() {
    if (state.started) {
      let status = timeline.progress();
      if (status > 0 && status < 1) {
        if (timeline.paused()) {
          timeline.resume()
        } else timeline.pause()
      }
    } else startTimeline()
  }

  let tween1Data = {
    onStart: onStart,
    onUpdate: drawFromDot, //remove requestAnimation if used
    // immediateRender: true,
    rotation: 360 * 5,
    duration: 4,
    transformOrigin: '0 0',
    // repeatRefresh: true,
    // width: 200,
    // height: 200,
    width: 'random(100, 280, 10)',
    get height() {
      return this.width
    },
    // height: function() {  
    //   return this.width
    // }
    // => doesn't work, cannot reference another property in a function. Must use a getter.
    ease: 'power3.out ',
  };

  let tween2Data = {
    duration: 4,
      scale: 3
  };

  // called in first Tween
  function onStart() {
    DOM.draw.beginPath()
    DOM.draw.lineWidth = 6;
    DOM.draw.strokeStyle = colours[state.replayCount];
    // animateRequest = requestAnimationFrame(drawFromDot)
  } 

   // called in last Tween or in timeline.then()
   function onComplete() {
    // cancelAnimation()
    state.started = false;
    state.timelinePlayed = true;
    state.replayCount < 5 ? state.replayCount++ : state.replayCount = 0;
    timeline.kill();
  }

  // called from animateDot()
  function startTimeline() {
    timeline = gsap.timeline();
    let tween1 = gsap.to(dotContainer, tween1Data);
    let tween2 = gsap.to(dot, tween2Data);
    // resets properties changed in tweens
    if (state.timelinePlayed) {
      timeline.set(dotContainer, {
        height: '20px', 
        width: '20px',
        rotation: 0
      })
      timeline.set(dot, {
        scale: 1 
      })
    }
    timeline
    .add(tween1)
    .add(tween2, '<')
    .then(function(x) {
      // console.log(x);
      onComplete()
      console.log('requested animation cancelled with then()')
    })
  }

  let currentX = (dot.getBoundingClientRect().left + dot.getBoundingClientRect().right) / 2 - canvasPosition.x;
  let currentY = (dot.getBoundingClientRect().top + dot.getBoundingClientRect().bottom) / 2 - canvasPosition.y;

  function getCurrentDotPosition() {
    let bounds = dot.getBoundingClientRect();
    let currentWidth = bounds.width;
    currentX = (bounds.left + bounds.right) / 2 - canvasPosition.x;
    currentY = (bounds.top + bounds.bottom) / 2 - canvasPosition.y;
  }

  // called from onStart() via animateRequest call or from onUpdate() in 1st tween:
  function drawFromDot() {
    state.drawCount++
    getCurrentDotPosition()
    if (!state.started) {
      state.dotPosition.start = [currentX, currentY];
      console.log(state.dotPosition.start)
      state.started = true;
    }
    /////////////////////////////////////////////
    // This block does nothing:
    if (state.moveTo) {
      DOM.draw.moveTo(currentX, currentY);
      state.moveTo = false;
    } else DOM.draw.lineTo(currentX, currentY);
    /////////////////////////////////////////////
    DOM.draw.lineTo(currentX, currentY);
    DOM.draw.stroke();
    // animateRequest = requestAnimationFrame(drawFromDot);
  }

  // only used externally if needed in console
  function getDrawCount() {
    return state.drawcount
  }

  function getState() {
    return state
  }

  function getTimeline() {
  return timeline
  }

  if (elements) {
    canvas_module_data = {
      animateDot,
      cancelAnimation,
      canvasPosition,
      currentX,
      currentY,
      DOM,
      dotPosition: state.dotPosition,
      draw: DOM.draw,
      drawOnCanvas,
      getDrawCount,
      getState,
      getTimeline
    }
  }

};


// })(); // end of Module

export {canvas_module, canvas_module_data}