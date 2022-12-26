/**
 * @fileoverview User model containing user information.
 */

const { Sequelize, DataTypes } = require('sequelize');
let sequelize = require('../config/db');

var User = sequelize.define("user", {
	user_name: {
		type: DataTypes.TEXT,
	},

	name: {
		type: DataTypes.TEXT,
	},

	email: {
		type: DataTypes.TEXT,
	},

	hash: {
		type: DataTypes.TEXT,
	}
}, {
	tableName: "user"
});

module.exports = User;