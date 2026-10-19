import { useEffect, useState } from 'react'
import useDebounce from '../hooks/useDebounce.js'
import { readJSON, removeItem, writeJSON } from '../utils/storage.js'

const moods = [
  ['happy', 'Радостное'],
  ['calm', 'Спокойное'],
  ['neutral', 'Нейтральное'],
  ['focused', 'Сосредоточенное'],
  ['excited', 'Воодушевлённое'],
  ['tired', 'Усталое'],
  ['sad', 'Грустное'],
]

function getToday() {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function createEmptyForm() {
  return {
    title: '',
    content: '',
    date: getToday(),
    mood: '',
    location: '',
    isPrivate: true,
    tags: '',
    photos: '',
  }
}

function splitValues(value) {
  return [...new Set(
    value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
  )]
}

function normalizeTags(value) {
  const seen = new Set()
  return splitValues(value).filter((tag) => {
    const normalized = tag.toLocaleLowerCase('ru-RU')
    if (seen.has(normalized)) return false
    seen.add(normalized)
    return true
  })
}

function getInitialForm(entry) {
  if (entry) {
    return {
      title: entry.title,
      content: entry.content,
      date: entry.date,
      mood: entry.mood ?? '',
      location: entry.location ?? '',
      isPrivate: entry.isPrivate,
      tags: entry.tags.join(', '),
      photos: entry.photos.join(', '),
    }
  }

  const savedDraft = readJSON('diary:draft', null)
  if (!savedDraft || typeof savedDraft !== 'object' || Array.isArray(savedDraft)) {
    return createEmptyForm()
  }
  return { ...createEmptyForm(), ...savedDraft }
}

function EntryForm({ entry, onSave, onCancel }) {
  const [form, setForm] = useState(() => getInitialForm(entry))
  const [error, setError] = useState('')
  const debouncedDraft = useDebounce(form, 500)
  const isDraftPending = JSON.stringify(form) !== JSON.stringify(debouncedDraft)

  // Отложенное сохранение убирает лишние записи в хранилище при каждом нажатии клавиши.
  useEffect(() => {
    if (entry) return
    const isEmpty =
      !formHasContent(debouncedDraft) &&
      debouncedDraft.date === getToday() &&
      debouncedDraft.isPrivate === true

    if (isEmpty) {
      removeItem('diary:draft')
    } else {
      writeJSON('diary:draft', debouncedDraft)
    }
  }, [debouncedDraft, entry])

  function updateField(event) {
    const { name, value, type, checked } = event.target
    setForm((previousForm) => ({
      ...previousForm,
      [name]: type === 'checkbox' ? checked : value,
    }))
    if (error) setError('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    const title = form.title.trim()
    const content = form.content.trim()
    if (!title || !content) {
      setError('Без заголовка и текста запись не получится.')
      return
    }

    onSave({
      ...(entry ? { id: entry.id } : {}),
      title,
      content,
      date: form.date,
      mood: form.mood,
      location: form.location.trim(),
      isPrivate: form.isPrivate,
      tags: normalizeTags(form.tags),
      photos: splitValues(form.photos),
    })
    removeItem('diary:draft')
    setForm(createEmptyForm())
    setError('')
  }

  function handleKeyDown(event) {
    if (event.key === 'Escape' && entry) {
      event.preventDefault()
      onCancel()
      return
    }

    const isSingleLineField =
      event.target instanceof HTMLInputElement &&
      event.target.type !== 'checkbox'
    const submitsTextarea =
      event.target instanceof HTMLTextAreaElement &&
      event.key === 'Enter' &&
      (event.ctrlKey || event.metaKey)

    if (event.key === 'Enter' && (isSingleLineField || submitsTextarea)) {
      event.preventDefault()
      event.currentTarget.requestSubmit()
    }
  }

  const showDraftStatus = !entry

  return (
    <form className="entry-form" onSubmit={handleSubmit} onKeyDown={handleKeyDown}>
      <div className="field field-wide">
        <label htmlFor="entry-title">Заголовок *</label>
        <input
          id="entry-title"
          name="title"
          value={form.title}
          onChange={updateField}
          placeholder="Как назовём этот день?"
          autoComplete="off"
        />
      </div>
      <div className="field">
        <label htmlFor="entry-date">Дата</label>
        <input id="entry-date" name="date" type="date" value={form.date} onChange={updateField} />
      </div>
      <div className="field field-wide">
        <label htmlFor="entry-content">Текст записи *</label>
        <textarea
          id="entry-content"
          name="content"
          value={form.content}
          onChange={updateField}
          placeholder="Что сегодня было…"
          rows="5"
        />
      </div>
      <div className="field">
        <label htmlFor="entry-mood">Настроение</label>
        <select id="entry-mood" name="mood" value={form.mood} onChange={updateField}>
          <option value="">Не выбрано</option>
          {moods.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
        </select>
      </div>
      <div className="field">
        <label htmlFor="entry-location">Место</label>
        <input
          id="entry-location"
          name="location"
          value={form.location}
          onChange={updateField}
          placeholder="Например, парк"
          autoComplete="off"
        />
      </div>
      <div className="field field-wide">
        <label htmlFor="entry-tags">Теги через запятую</label>
        <input
          id="entry-tags"
          name="tags"
          value={form.tags}
          onChange={updateField}
          placeholder="личное, отдых"
          autoComplete="off"
        />
      </div>
      <div className="field field-wide">
        <label htmlFor="entry-photos">Фото URL через запятую</label>
        <input
          id="entry-photos"
          name="photos"
          value={form.photos}
          onChange={updateField}
          placeholder="https://example.com/photo.jpg"
          autoComplete="off"
        />
      </div>
      <div className="checkbox-field field-wide">
        <input
          id="entry-private"
          name="isPrivate"
          type="checkbox"
          checked={form.isPrivate}
          onChange={updateField}
        />
        <label htmlFor="entry-private">Приватная запись</label>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      {showDraftStatus && (
        <p className="draft-status" aria-live="polite">
          <span className={`draft-indicator${isDraftPending ? ' pending' : ''}`} />
          {isDraftPending ? 'Черновик пишется…' : 'Черновик сохранён'}
        </p>
      )}
      <div className="form-actions">
        <button className="button button-primary" type="submit">
          {entry ? 'Сохранить' : 'Записать'}
        </button>
        {entry && (
          <button className="button button-secondary" type="button" onClick={onCancel}>
            Отмена
          </button>
        )}
      </div>
    </form>
  )
}

function formHasContent(form) {
  return Boolean(
    form.title.trim() ||
    form.content.trim() ||
    form.mood ||
    form.location.trim() ||
    form.tags.trim() ||
    form.photos.trim(),
  )
}

export default EntryForm
