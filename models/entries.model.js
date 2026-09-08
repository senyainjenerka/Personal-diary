let nextId = 4;

const entries = [
  {
    id: 1,
    title: 'Прогулка в парке',
    content: 'Сегодня долго гулял в парке и читал книгу на скамейке.',
    date: new Date('2026-09-01T10:00:00.000Z'),
    mood: 'happy',
    photos: ['/photos/park.jpg'],
    isPrivate: true
  },
  {
    id: 2,
    title: 'Новый учебный проект',
    content: 'Начал разрабатывать REST API для личного дневника.',
    date: new Date('2026-09-02T14:30:00.000Z'),
    mood: 'focused',
    photos: [],
    isPrivate: false
  },
  {
    id: 3,
    title: 'Тихий вечер',
    content: 'Вечером слушал музыку и планировал задачи на завтра.',
    date: new Date('2026-09-03T19:15:00.000Z'),
    mood: 'neutral',
    photos: [],
    isPrivate: true
  }
];

function getAllEntries() {
  return entries;
}

function getEntryById(id) {
  return entries.find((entry) => entry.id === id);
}

function addEntry(entryData) {
  const entry = { id: nextId++, ...entryData };
  entries.push(entry);
  return entry;
}

function updateEntry(id, entryData) {
  const entryIndex = entries.findIndex((entry) => entry.id === id);

  if (entryIndex === -1) {
    return undefined;
  }

  const updatedEntry = { id, ...entryData };
  entries[entryIndex] = updatedEntry;
  return updatedEntry;
}

function deleteEntry(id) {
  const entryIndex = entries.findIndex((entry) => entry.id === id);

  if (entryIndex === -1) {
    return false;
  }

  entries.splice(entryIndex, 1);
  return true;
}

module.exports = {
  getAllEntries,
  getEntryById,
  addEntry,
  updateEntry,
  deleteEntry
};
