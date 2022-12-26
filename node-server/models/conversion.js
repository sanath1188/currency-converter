/**
 * @fileoverview User model containing user information.
 */

 const { Sequelize, DataTypes } = require('sequelize');
 let sequelize = require('../config/db');
 
 var Conversion = sequelize.define("conversion", {
   currency: {
     type: DataTypes.TEXT,
   },
 
   exchange_rate: {
     type: DataTypes.NUMBER,
   },

   updated_on: {
     type: DataTypes.DATE
   },

   invalid: {
    type: DataTypes.BOOLEAN
  }
 }, {
   tableName: "conversion"
 });
 
 module.exports = Conversion;