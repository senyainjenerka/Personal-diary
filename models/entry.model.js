const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('Entry', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  title: { type: DataTypes.STRING, allowNull: false, validate: { notEmpty: { msg: 'Field "title" is required and must be a non-empty string' } } },
  content: { type: DataTypes.TEXT, allowNull: false, validate: { notEmpty: { msg: 'Field "content" is required and must be a non-empty string' } } },
  date: { type: DataTypes.DATEONLY, allowNull: false, defaultValue: DataTypes.NOW },
  mood: { type: DataTypes.STRING, allowNull: true },
  isPrivate: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: true },
  userId: { type: DataTypes.INTEGER, allowNull: true },
  location: { type: DataTypes.STRING, allowNull: true }
}, { tableName: 'Entries' });