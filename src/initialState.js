function getInitialState(source) {
  let obj = Object.assign({}, source);
  let sourceCopy = JSON.parse(JSON.stringify(obj));
  return sourceCopy
}

function resetInitialState(target, source) {
  let sourceCopy = JSON.parse(JSON.stringify(source));
  Object.assign(target, getInitialState(sourceCopy));
}

export {getInitialState, resetInitialState}

// let source = this.$store.state.users;

// TESTING:

/* let initialObj = {
  a: 'one',
  b: 'two',
  c: 'three'
}

const initialObjCopy = getInitialState(initialObj);
console.log('initialObjCopy was created')
console.log('initialObj: ', initialObj)
initialObj.a = 'uno';
console.log('initialObj.a was changed')
console.log('initialObj: ', initialObj)
console.log('initialObjCopy: ', initialObjCopy)

resetInitialState(initialObj, initialObjCopy)
console.log('initialObj was reset')
console.log('initialObj: ', initialObj)
console.log('initialObjCopy: ', initialObjCopy)
initialObjCopy.b = 'dos';
console.log('initialObjCopy.b was changed')
console.log('initialObj: ', initialObj)
console.log('initialObjCopy: ', initialObjCopy) */