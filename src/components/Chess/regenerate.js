// const getChessAPIData = require('./Chess.com_API.js');
const testCode = require('./test_code.js')

// let es6Source = getChessAPIData;
let es6Source = testCode;
 
var es5Source = require('regenerator').compile(es6Source).code;

console.log(es5Source)
console.log(es6Source);