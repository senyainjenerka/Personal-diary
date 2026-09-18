const { Tag } = require('../models');

async function getAllTags(req, res, next) {
  try {
    return res.json(await Tag.findAll({ order: [['name', 'ASC']] }));
  } catch (error) {
    return next(error);
  }
}

module.exports = { getAllTags };