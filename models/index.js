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
const EntryTag = require('./entry-tag.model')(sequelize);
const User = require('./user.model')(sequelize);

Entry.hasMany(Photo, { foreignKey: 'entryId', as: 'photos', onDelete: 'CASCADE' });
Photo.belongsTo(Entry, { foreignKey: 'entryId' });
Entry.belongsToMany(Tag, { through: EntryTag, as: 'tags', foreignKey: 'entryId' });
Tag.belongsToMany(Entry, { through: EntryTag, as: 'entries', foreignKey: 'tagId' });
User.hasMany(Entry, { foreignKey: 'userId', as: 'entries', onDelete: 'CASCADE' });
Entry.belongsTo(User, { foreignKey: 'userId' });

module.exports = { sequelize, Entry, Photo, Tag, EntryTag, User };