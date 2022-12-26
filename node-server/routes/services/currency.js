const Conversion = require('../../models/conversion');

let getCurrency = function (currencyName) {
  const promise = new Promise(async (resolve, reject) => {
    try {
      if(currencyName) {
        let whereObj = {
          currency: currencyName
        };
  
        let currency = await Conversion.findOne({
          where: whereObj,
          raw: true
        });
  
        resolve(currency);
      } else {
        let currencyList = await Conversion.findAll({
          raw: true
        });
  
        resolve(currencyList);
      }
    } catch (err) {
      reject(err);
    };
  })

  return promise;
}

module.exports = {
  getCurrency
}