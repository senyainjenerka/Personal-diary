const { Sequelize } = require('sequelize');
const config = require('../config/config')[process.env.NODE_ENV || 'development'];

const sequelize = new Sequelize(process.env[config.use_env_variable], {
  dialect: config.dialect,
  dialectOptions: config.dialectOptions,
  logging: false
});

const Entry = require('./entry.model')(sequelize);
const Photo = require('./photo.model')(sequelize);
const Tag = require('./tag.model')(sequelize);

Entry.hasMany(Photo, { foreignKey: 'entryId', as: 'photos', onDelete: 'CASCADE' });
Photo.belongsTo(Entry, { foreignKey: 'entryId' });
Entry.belongsToMany(Tag, { through: 'EntryTag', as: 'tags', foreignKey: 'entryId' });
Tag.belongsToMany(Entry, { through: 'EntryTag', as: 'entries', foreignKey: 'tagId' });

module.exports = { sequelize, Entry, Photo, Tag };