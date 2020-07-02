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

  function elementDrag(event) {
    event.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - event.clientX;
    pos2 = pos4 - event.clientY;
    pos3 = event.clientX;
    pos4 = event.clientY;
    // set the element's new position:
    element.style.top = (element.offsetTop - pos2) + "px";
    element.style.left = (element.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    /* stop moving when mouse button is released:*/
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

export default createDraggableEvents;