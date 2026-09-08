const entriesModel = require('../models/entries.model');

function parseId(id) {
  const parsedId = Number(id);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

function validateEntryData(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return 'Request body must be a JSON object';
  }

  if (typeof data.title !== 'string' || data.title.trim() === '') {
    return 'Field "title" is required and must be a non-empty string';
  }

  if (typeof data.content !== 'string' || data.content.trim() === '') {
    return 'Field "content" is required and must be a non-empty string';
  }

  if (data.date !== undefined && (typeof data.date !== 'string' || Number.isNaN(new Date(data.date).getTime()))) {
    return 'Field "date" must be a valid ISO date string';
  }

  if (data.mood !== undefined && typeof data.mood !== 'string') {
    return 'Field "mood" must be a string';
  }

  if (data.photos !== undefined && (!Array.isArray(data.photos) || data.photos.some((photo) => typeof photo !== 'string'))) {
    return 'Field "photos" must be an array of strings';
  }

  if (data.isPrivate !== undefined && typeof data.isPrivate !== 'boolean') {
    return 'Field "isPrivate" must be a boolean';
  }

  return null;
}

function normalizeEntryData(data) {
  return {
    title: data.title.trim(),
    content: data.content.trim(),
    date: data.date ? new Date(data.date) : new Date(),
    ...(data.mood !== undefined && { mood: data.mood }),
    photos: data.photos || [],
    isPrivate: data.isPrivate !== undefined ? data.isPrivate : true
  };
}

function getAllEntries(req, res) {
  const { isPrivate } = req.query;
  let entries = entriesModel.getAllEntries();

  if (isPrivate !== undefined) {
    if (isPrivate !== 'true' && isPrivate !== 'false') {
      return res.status(400).json({ error: 'Query parameter "isPrivate" must be true or false' });
    }

    entries = entries.filter((entry) => entry.isPrivate === (isPrivate === 'true'));
  }

  return res.json(entries);
}

function getEntryById(req, res) {
  const id = parseId(req.params.id);
  const entry = id === null ? undefined : entriesModel.getEntryById(id);

  if (!entry) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  return res.json(entry);
}

function createEntry(req, res) {
  const validationError = validateEntryData(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  const entry = entriesModel.addEntry(normalizeEntryData(req.body));
  return res.status(201).json(entry);
}

function replaceEntry(req, res) {
  const id = parseId(req.params.id);
  const validationError = validateEntryData(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  if (id === null || !entriesModel.getEntryById(id)) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  const entry = entriesModel.updateEntry(id, normalizeEntryData(req.body));
  return res.json(entry);
}

function removeEntry(req, res) {
  const id = parseId(req.params.id);

  if (id === null || !entriesModel.getEntryById(id)) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  entriesModel.deleteEntry(id);
  return res.status(200).json({ message: 'Entry deleted successfully' });
}

module.exports = {
  getAllEntries,
  getEntryById,
  createEntry,
  replaceEntry,
  removeEntry
};
