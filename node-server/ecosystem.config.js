/* eslint-disable camelcase */
module.exports = {
	apps : [
		{
			name      : "backend",
			script    : "./index.js",
			env: {
				NODE_ENV: "development"
			}
		},
		{
			name: "cron-jobs",
			script: "./cron/index.js"
		}
	]
};
