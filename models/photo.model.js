const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Photo', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  url: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: true } },
  entryId: { type: DataTypes.INTEGER, allowNull: false }
}, { tableName: 'Photos' });