const { Entry, Photo, Tag } = require('../models');

function parseId(id) {
  const parsedId = Number(id);
  return Number.isInteger(parsedId) && parsedId > 0 ? parsedId : null;
}

function validateEntryData(data, partial = false) {
  if (!data || typeof data !== 'object' || Array.isArray(data)) {
    return 'Request body must be a JSON object';
  }

  if (!partial && (typeof data.title !== 'string' || data.title.trim() === '')) {
    return 'Field "title" is required and must be a non-empty string';
  }

  if (!partial && (typeof data.content !== 'string' || data.content.trim() === '')) {
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

  if (data.tags !== undefined && (!Array.isArray(data.tags) || data.tags.some((tag) => typeof tag !== 'string' || tag.trim() === ''))) {
    return 'Field "tags" must be an array of non-empty strings';
  }

  if (data.location !== undefined && typeof data.location !== 'string') {
    return 'Field "location" must be a string';
  }

  return null;
}

function normalizeEntryData(data) {
  const entryData = { ...data };
  if (entryData.title !== undefined) entryData.title = entryData.title.trim();
  if (entryData.content !== undefined) entryData.content = entryData.content.trim();
  delete entryData.photos;
  delete entryData.tags;
  delete entryData.userId;
  return entryData;
}

const include = [{ association: 'photos' }, { association: 'tags' }];

async function getAllEntries(req, res, next) {
  const { isPrivate } = req.query;
  if (isPrivate !== undefined) {
    if (isPrivate !== 'true' && isPrivate !== 'false') {
      return res.status(400).json({ error: 'Query parameter "isPrivate" must be true or false' });
    }

    return Entry.findAll({ where: { userId: req.user.id, isPrivate: isPrivate === 'true' }, include }).then((entries) => res.json(entries)).catch(next);
  }

  return Entry.findAll({ where: { userId: req.user.id }, include }).then((entries) => res.json(entries)).catch(next);
}

async function getEntryById(req, res, next) {
  const id = parseId(req.params.id);
  let entry = null;
  try {
    entry = id === null ? null : await Entry.findByPk(id, { include });
  } catch (error) {
    return next(error);
  }

  if (!entry) {
    return res.status(404).json({ error: 'Entry not found' });
  }
  if (entry.userId !== req.user.id) {
    return res.status(404).json({ error: 'Entry not found' });
  }

  return res.json(entry);
}

async function createEntry(req, res, next) {
  const validationError = validateEntryData(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const entry = await Entry.create({ ...normalizeEntryData(req.body), userId: req.user.id });
    await updateRelations(entry, req.body);
    return res.status(201).json(await Entry.findByPk(entry.id, { include }));
  } catch (error) { return next(error); }
}

async function replaceEntry(req, res, next) {
  const id = parseId(req.params.id);
  const validationError = validateEntryData(req.body);

  if (validationError) {
    return res.status(400).json({ error: validationError });
  }

  try {
    const existingEntry = id === null ? null : await Entry.findByPk(id);
    if (!existingEntry || existingEntry.userId !== req.user.id) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    await Entry.update(normalizeEntryData(req.body), { where: { id, userId: req.user.id } });
    const entry = await Entry.findByPk(id);
    await updateRelations(entry, req.body);
    return res.json(await Entry.findByPk(id, { include }));
  } catch (error) { return next(error); }
}

async function removeEntry(req, res, next) {
  const id = parseId(req.params.id);

  try {
    const entry = id === null ? null : await Entry.findByPk(id);
    if (!entry || entry.userId !== req.user.id) {
      return res.status(404).json({ error: 'Entry not found' });
    }
    await Entry.destroy({ where: { id, userId: req.user.id } });
    return res.status(200).json({ message: 'Entry deleted successfully' });
  } catch (error) { return next(error); }
}

async function updateRelations(entry, data) {
  if (data.photos !== undefined) {
    await Photo.destroy({ where: { entryId: entry.id } });
    await Photo.bulkCreate(data.photos.map((url) => ({ url, entryId: entry.id })));
  }
  if (data.tags !== undefined) {
    const tags = await Promise.all(data.tags.map((name) => Tag.findOrCreate({ where: { name: name.trim() } }).then(([tag]) => tag)));
    await entry.setTags(tags);
  }
}

module.exports = {
  getAllEntries,
  getEntryById,
  createEntry,
  replaceEntry,
  removeEntry
};
