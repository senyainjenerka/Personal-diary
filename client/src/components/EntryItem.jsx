import { memo } from 'react'

const moodLabels = {
  happy: 'радостно',
  calm: 'спокойно',
  neutral: 'нейтрально',
  focused: 'сосредоточенно',
  excited: 'воодушевлённо',
  tired: 'устало',
  sad: 'грустно',
}

function formatDate(date) {
  const value = new Date(`${date}T00:00:00`)
  return {
    weekday: new Intl.DateTimeFormat('ru-RU', { weekday: 'long' }).format(value),
    date: new Intl.DateTimeFormat('ru-RU', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(value),
  }
}

function highlightText(text, query) {
  const searchTerm = query.trim()
  if (!searchTerm) return text

  const escapedQuery = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const parts = text.split(new RegExp(`(${escapedQuery})`, 'giu'))
  return parts.map((part, index) =>
    part.toLocaleLowerCase('ru-RU') === searchTerm.toLocaleLowerCase('ru-RU')
      ? <mark key={`${index}-${part}`}>{part}</mark>
      : part,
  )
}

function EntryItem({ entry, search, onEdit, onDelete }) {
  const formattedDate = formatDate(entry.date)

  return (
    <article className={`entry-sheet${entry.isPrivate ? ' entry-private' : ''}`}>
      <div className="entry-date-column">
        <time className="entry-date" dateTime={entry.date}>
          <span>{formattedDate.weekday}</span>
          <span>{formattedDate.date}</span>
        </time>
      </div>
      <div className="entry-body">
        <div className="entry-heading">
          <h3>{highlightText(entry.title, search)}</h3>
          {entry.isPrivate && <span className="private-stamp">ЛИЧНОЕ</span>}
        </div>
        <div className="entry-stamps">
          {entry.mood && <span className="mood-stamp">{moodLabels[entry.mood] ?? entry.mood}</span>}
          {entry.location && <span className="entry-location">{entry.location}</span>}
        </div>
        <p className="entry-content">{highlightText(entry.content, search)}</p>
        {entry.tags.length > 0 && (
          <p className="tag-list" aria-label="Теги">
            {entry.tags.map((tag, index) => <span className="tag-text" key={`${tag}-${index}`}>#{tag}</span>)}
          </p>
        )}
        {entry.photos.length > 0 && (
          <div className="photo-list" aria-label="Фотографии записи">
            {entry.photos.map((photo, index) => (
              <img
                className={`entry-photo entry-photo-${index % 2}`}
                key={`${photo}-${index}`}
                src={photo}
                alt={`Фото ${index + 1} к записи «${entry.title}»`}
                onError={(event) => {
                  event.currentTarget.hidden = true
                }}
              />
            ))}
          </div>
        )}
        <div className="entry-actions">
          <button className="text-button" type="button" onClick={() => onEdit(entry.id)}>
            Править
          </button>
          <button className="text-button delete-button" type="button" onClick={() => onDelete(entry.id)}>
            Удалить
          </button>
        </div>
      </div>
    </article>
  )
}

export default memo(EntryItem)
