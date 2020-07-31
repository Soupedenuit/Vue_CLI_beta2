// returns the number of milliseconds since January 1, 1970, 00:00:00 UTC
function convertToUTC(date) {
  let convertableDate = new Date(date);
  // [Source: Stack Overflow, user: DrunkCoder]
  // https://stackoverflow.com/questions/948532/how-do-you-convert-a-javascript-date-to-utc
  let utcDate =  
  Date.UTC( 
  convertableDate.getUTCFullYear(), 
  convertableDate.getUTCMonth(), 
  convertableDate.getUTCDate(),
  convertableDate.getUTCHours(), 
  convertableDate.getUTCMinutes(), 
  convertableDate.getUTCSeconds()
  );
  return utcDate
}

// returns readable date from UTC input
function convertToDate(utc) {
  let date = new Date(utc);
  return date
}
//#region <TESTING>
// let test1 = 'Sun Jul 26 2020 17:14';
// let test2 = 1595821333908;

// console.log('convertToUTC: ', convertToUTC(test1))
// console.log('convertToDate: ', convertToDate(test2))
//#endregion

export {convertToUTC, convertToDate}