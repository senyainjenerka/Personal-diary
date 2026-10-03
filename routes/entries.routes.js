const express = require('express');
const entriesController = require('../controllers/entries.controller');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.use(authMiddleware);

router.get('/', entriesController.getAllEntries);
router.get('/:id', entriesController.getEntryById);
router.post('/', entriesController.createEntry);
router.put('/:id', entriesController.replaceEntry);
router.delete('/:id', entriesController.removeEntry);

module.exports = router;
