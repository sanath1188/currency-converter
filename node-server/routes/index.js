var api = require('./api');
var router  = require("express").Router();

router.use("/api", api);

module.exports = router;