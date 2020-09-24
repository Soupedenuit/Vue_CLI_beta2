if (!window) {
  const fetch = require('node-fetch');
}

let url_json = 'https://vue-beta2.firebaseio.com/public/published/blog.json';

function populateTargetWithXHR() {
  return new Promise(function(resolve, reject) {
    const xhr = new XMLHttpRequest();
    let url = url_json;
    xhr.open('GET', url_json, true)
    xhr.onreadystatechange = function() {
      // console.log(xhr.responseText)
      if (xhr.readyState === xhr.DONE) {
        if (xhr.status === 200) {
          console.log('ok, status 200');
          let htmlString = JSON.parse(xhr.responseText);
          resolve(htmlString)
        }
      }
    }
    xhr.send(null)
  })
}

function populateTargetWithFetch(urlType) {
  let url = urlType == 'text' ? url_text : url_json;
  let htmlString = '<p>test only</p>';
  return new Promise(function(resolve, reject) {
    fetch(url)
    .then(function(result) {
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


export {populateTargetWithFetch, populateTargetWithXHR, lastUpdated};