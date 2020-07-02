function addCentreDot(el) {
  let fragment = document.createDocumentFragment();
  let dot = document.createElement('div');
  let container = document.createElement('div');
  container.id = 'dot-container';
  dot.id = 'dot';
  container.style.cssText = `
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: none;
    top: 438px;
    left: 50%;
  `;
  dot.style.cssText = `
    position: absolute;
    width: 10px;
    height: 10px;
    background-color: white;
    border-radius: 50%;
    bottom: 0px;
    right: 0px;
  `;
  container.appendChild(dot);
  fragment.appendChild(container);
  // document.body.appendChild(fragment);
  el.appendChild(fragment);
  console.log('centre dot created & appended')
  // let dot = document.querySelector('#dot');
  let elements = [dot, container];
  return new Promise(function(resolve, reject) {
    resolve(elements)
    console.log('resolved Promise!');
    
  })
}


// export {createCentreDot, dot, dotContainer}
export default addCentreDot