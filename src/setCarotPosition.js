// Credits: http://blog.vishalon.net/index.php/javascript-getting-and-setting-caret-position-in-textarea/
// Via https://codepen.io/chrisshaw/pen/yNOVaz?editors=0010
import eventHub from '@/eventHub.js';

function setCaretPosition(ctrl, pos) {
  // Modern browsers
  if (ctrl.setSelectionRange) {
    ctrl.focus();
    ctrl.setSelectionRange(pos, pos);
  
  // IE8 and below
  } else if (ctrl.createTextRange) {
    var range = ctrl.createTextRange();
    range.collapse(true);
    range.moveEnd('character', pos);
    range.moveStart('character', pos);
    range.select();
  }
}

// Example:  Set the cursor position of the "#test-input" element to the end when the page loads
// var input = document.getElementById('test-input');
// setCaretPosition(input, input.value.length);


// Credits: me
function addElementTags(event, {
  tag,
  text,
  cursorAtEnd = false, //default
  }) {

  let target = document.getElementById('blog-text');
  let cursorAdvance;
  if (tag === 'multi-list') {
    cursorAdvance = 10;
  } else if (tag === 'enter') {
    cursorAdvance = 1;
  } else cursorAdvance = tag.length + 2;
  
  const textValue = target.value;
  const textValueLength = target.value.length;
  const allowedTargets = ['INPUT', 'TEXTAREA'];
  if (allowedTargets.includes(target.nodeName)) {
    let currentPos = target.selectionStart;
    // console.log('currentPos: ', currentPos);
    let nextPos = currentPos + cursorAdvance;
    currentPos === textValueLength ? cursorAtEnd = true : cursorAtEnd = false;
    if (cursorAtEnd) {
      target.value += text;
    } else target.value = textValue.slice(0, currentPos) + text + textValue.slice(currentPos, textValueLength);
    // If we are using 2-way binding (v-model) to update textarea content, and we separately try to update textarea content using DOM property 'value' like we are doing here with addElementTags(), textarea content will update, however the data tied to v-model in our vue instance will not update.
    // So, we need to update the 'blogText' data on the instance via addElementTags() so that our added tags do not disappear on any instance refresh. This was a problem when I attempted to update the binded class displayList (my new added tags would disappear upon toggling tagsList):
    // What we should be doing is discarding target.value entirely and only using data from Vue instance (to follow)
    eventHub.$emit('update_blogText', target.value)
    setCaretPosition(target, nextPos)
  } else window.alert('target is not <input> or <textarea>')
}


export default addElementTags