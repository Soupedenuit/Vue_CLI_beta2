// Detect browser the "Duck-Typing" way. This function looks at methods unique to each browser:

function detectBrowser() {

  const browsers = {
    // Opera 8.0+
    isOpera: (!!window.opr && !!opr.addons) || !!window.opera || (navigator.userAgent.indexOf(' OPR/') >= 0),
    // Firefox 1.0+
    isFirefox: typeof InstallTrigger !== 'undefined',
    // Safari 3.0+ "[object HTMLElementConstructor]" 
    isSafari: /constructor/i.test(window.HTMLElement) || (function (p) { return p.toString() === "[object SafariRemoteNotification]"; })(!window['safari'] || (typeof safari !== 'undefined' && safari.pushNotification)),
    // Internet Explorer 6-11
    isIE: eval("/*@cc_on!@*/false") || !!document.documentMode,
    // Edge 20+
    get _isEdge() {
      return !this._isIE && !!window.StyleMedia
    },
    // get _isBrave() {
    //   let result;
    //   if (!navigator.brave || !navigator.brave.isBrave) {
    //     return false
    //   } else {
    //     navigator.brave.isBrave() //returns a resolved promise
    //     .then(result=> value = result)
    //     .catch(error=>console.log(error))
    //     return result
    //   }
    // }
    get _isBrave() {
      if (!navigator.brave || !navigator.brave.isBrave) {
        return false
      } else {
        return Boolean(navigator.brave.isBrave()) //returns a resolved promise
      }
    },
    // Chrome 1+
    get _isChrome() {
      return !!window.chrome && !this._isBrave
    }
  }

  let validBrowsers = [];

  for (let browser in browsers) {
    if (browsers[browser]) {
      validBrowsers.push(browser)
    }
  }

  return validBrowsers

}

// console.log("Opera - " + isOpera);
// console.log("Firefox - " + isFirefox);
// console.log("Safari - " + isSafari);
// console.log("IE - " + isIE);
// console.log("Edge - " + isEdge);
// console.log("Chrome - " + isChrome);
// console.log("Blink - " + isBlink);