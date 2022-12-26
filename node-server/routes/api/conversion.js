let router = require("express").Router();

const { currencySvc } = require('../services');

router.get('/conversion', async (req, res) => {
  const fromCurrencyName = req.query.from;
  const toCurrencyName = req.query.to;
  const totalAmount = req.query.amount;

  [fromCurrency, toCurrency] = await Promise.all([
    currencySvc.getCurrency(fromCurrencyName),
    currencySvc.getCurrency(toCurrencyName),
  ]);

  if(fromCurrency.invalid || toCurrency.invalid) {
    return res.status(500).json({
      status: 'error',
      message: 'Invalid currency type'
    });
  }

  const convertedAmount = (toCurrency.exchange_rate / fromCurrency.exchange_rate) * totalAmount;

  return res.status(200).json({
    status: 'success',
    data: {
      convertedAmount,
      latestUpdate: fromCurrency.updated_on > toCurrency.updated_on ? fromCurrency.updated_on : toCurrency.updated_on
    }
  });
})

module.exports = router;