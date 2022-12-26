let router = require("express").Router();

const { currencySvc } = require('../services');

router.get('/currency/:currencyName?', async (req, res) => {
  const currencyName = req.params.currencyName;

  let currency = await currencySvc.getCurrency(currencyName);

  return res.status(200).json({
    status: 'success',
    data: currency
  });
})

module.exports = router;