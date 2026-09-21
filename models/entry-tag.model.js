const { DataTypes } = require('sequelize');

module.exports = (sequelize) => sequelize.define('EntryTag', {
  entryId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: { model: 'Entries', key: 'id' }
  },
  tagId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    references: { model: 'Tags', key: 'id' }
  }
}, {
  tableName: 'EntryTag',
  timestamps: false,
  freezeTableName: true
});
