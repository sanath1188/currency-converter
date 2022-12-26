const { Sequelize } = require('sequelize');

const config = require('config');
const mysql2   = require('mysql2');

let host = config.get('dbConfig.mysql.host');
let database = config.get('dbConfig.mysql.database');
let username = config.get('dbConfig.mysql.username');
let password = config.get('dbConfig.mysql.password');

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: 3306,
  dialect: 'mysql',
  dialectModule: mysql2,
  logging: false, // Set to console.log if you would like to log all the queries.
  // Global definitions on how we want sequelize to treat models and column names.
  define: {
    timestamps: false,
    underscored: true,
  }
});

sequelize.authenticate().then(function () {
		console.log("Successfully connected to the database!");
}, function (err) {
  console.log("Error connecting to the database :(")
});

module.exports = sequelize;