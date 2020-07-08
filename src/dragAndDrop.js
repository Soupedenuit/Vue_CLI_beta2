// Source:  https://www.w3schools.com/howto/howto_js_draggable.asp

function createDraggableEvents() {
  let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  const element = document.getElementById('draggable-list');
  const grabber = document.getElementById('drag-grabber');
  dragElement()

  function dragElement() {
    grabber.addEventListener('mousedown', function(event) {
      dragMouseDown(event)
    })
    grabber.addEventListener('touchstart', function(event) {
      console.log('touched')
      dragTouchDown(event)
    })
  }
  
  function dragMouseDown(event) {
    event.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = event.clientX;
    pos4 = event.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }
  
  function dragTouchDown(event) {
    event.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = event.touches[0].clientX;
    pos4 = event.touches[0].clientY;
    document.addEventListener('touchend', closeDragElement)
    // call a function whenever the cursor moves:
    document.addEventListener('touchmove', function(event) {
      elementDrag(event, 'touch')
    })
  }
  
  function elementDrag(event, type) {
    console.log(event);
    console.log(type);
    let eventX;
    let eventY;
    let eventType;
    if (type !== 'touch') {
      event.preventDefault()
    }
    if (type === 'touch') {
      eventX = event.touches[0].clientX;
      eventY = event.touches[0].clientY;
      eventType = type;
    } else {
      eventX = event.clientX;
      eventY = event.clientY;
      eventType = 'mouse';
    }
    console.log(`${eventType}: ${eventX}`);
    console.log(`${eventType}: ${eventY}`);
    // calculate the new cursor position:
    pos1 = pos3 - eventX; //event.clientX;
    pos2 = pos4 - eventY; //event.clientY;
    pos3 = eventX; //event.clientX;
    pos4 = eventY; //event.clientY;
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
    document.ontouchend = null;
    document.ontouchmove = null;
  }
}

export default createDraggableEvents;