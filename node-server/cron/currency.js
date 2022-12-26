/**
 * @fileOverview Cron job to make promo codes and gift cards expire at their end date and time.
 */

const db = require('../config/db.js');
var config = require("config");

const Conversion = require('../models/conversion');
const axios = require('axios').default;

const EXCHANGE_RATE_URL = 'http://api.exchangeratesapi.io/v1/latest?access_key=';

/** Updates the daily rates in the db */
let updateDailyExchangeRates = async function () {
  console.log('fetching exchange rates...');

  let exchangeRatesDataRes = await axios({
    method: 'get',
    url: EXCHANGE_RATE_URL + config.get("exchangeRateKey")
  })

  let exchangeRatesData = exchangeRatesDataRes.data;

  Object.keys(exchangeRatesData.rates).map(async (key) => {
    let currencyName = key;
    let currencyValue = exchangeRatesData.rates[key];

    let existingConversion = await Conversion.findOne({
      where: {
        currency: currencyName
      }
    });

    if (existingConversion) {
      console.log('updating ' + currencyName);

      existingConversion.update({
        exchange_rate: currencyValue,
        updated_on: new Date()
      })
    } else {
      console.log('inserting ' + currencyName);

      Conversion.create({
        currency: currencyName,
        exchange_rate: currencyValue,
        updated_on: new Date()
      })
    }
  });
}

module.exports = {
  updateDailyExchangeRates: updateDailyExchangeRates,
};