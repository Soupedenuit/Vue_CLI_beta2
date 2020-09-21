if (!window) {
  const fetch = require('node-fetch');
}

// let url = './text.txt'; // cannot fetch locally
let url_text = 'http://192.168.0.12:8081//text.txt';
let url_json = 'https://vue-beta2.firebaseio.com/public/published/blog.json';

function populateTarget(urlType) {
  let url;
  urlType == 'text' ? url = url_text : url = url_json;
  let htmlString = '<p>test only</p>';
  return new Promise(function(resolve, reject) {
    let request = fetch(url);
    request.then(function(result) {
      // console.log(target);
      console.log(result);
      if (urlType == 'text') {
        return result.text()
      } else return result.json()
    })
    .then((data) => {
      // console.log(data);
      if (urlType == 'text') {
        htmlString = addText(data); 
      } else htmlString = data; // Firebase API
      resolve(htmlString)
    })
    //The Promise returned from fetch() won’t reject on HTTP error status even if the response is an HTTP 404 or 500. Instead, it will resolve normally (with ok status set to false), and it will only reject on network failure or if anything prevented the request from completing.
    .catch((error) => {
      console.log(error);
      reject(error)
    })
  })
}

// Configured specifically for Firebase API:
function addData(data, target) {
  let htmlString = data;
  return htmlString;
}

// Configured for any text file:
function addText(data, target) {
  let lines = data.split('\n');
  let text = [];
  lines.forEach(function(line) {
    text.push(`${line}<br>`)
  });
  let paragraph = `<p>${text.join('')}</p>`;
  document.querySelector(target).innerHTML = paragraph;
}

function lastUpdated() {
  let date = new Date().toString().substring(0,24);
  let display = `Last updated: ${date}`;
  return display;
}


export {populateTarget, lastUpdated};