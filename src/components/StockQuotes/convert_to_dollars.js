const convertToDollars = function(number) {
  if ( number ) {
    let amount = number.toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return `\$ ${amount}`
  } else return `\$ 0.00`
}; 

const convertFromDollars = function(dollars) {
  if ( dollars ) {
    let regex = /[\d+\.]/g;
    let amount = dollars.match(regex).join('');
    return amount
  } else return 0
}


export {convertToDollars, convertFromDollars}