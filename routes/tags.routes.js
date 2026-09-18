const express = require('express');
const tagsController = require('../controllers/tags.controller');

const router = express.Router();

router.get('/', tagsController.getAllTags);

module.exports = router;