const CronJob = require("cron").CronJob;
const updateDailyExchangeRates = require("./currency").updateDailyExchangeRates;

const defaultTimeZone = "America/New_York";

/** Runs 1AM at EST every day. */
new CronJob("0 0 1 * * *", updateDailyExchangeRates, null, true, defaultTimeZone);

