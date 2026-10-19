import { memo } from 'react'

const moodLabels = {
  happy: 'Радостное',
  calm: 'Спокойное',
  neutral: 'Нейтральное',
  focused: 'Сосредоточенное',
  excited: 'Воодушевлённое',
  tired: 'Усталое',
  sad: 'Грустное',
}

function formatDate(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(`${date}T00:00:00`))
}

function EntryItem({ entry, onEdit, onDelete }) {
  return (
    <article className="entry-card">
      <div className="entry-topline">
        <div className="entry-title-group">
          <p className="entry-date">{formatDate(entry.date)}</p>
          <h3>{entry.title}</h3>
          <div className="badge-row">
            <span className="badge badge-privacy">
              {entry.isPrivate ? 'Приватная' : 'Публичная'}
            </span>
            {entry.mood && <span className="badge badge-mood">{moodLabels[entry.mood] ?? entry.mood}</span>}
          </div>
        </div>
      </div>
      {entry.location && <p className="entry-location">⌖ {entry.location}</p>}
      <p className="entry-content">{entry.content}</p>
      {entry.tags.length > 0 && (
        <div className="tag-list" aria-label="Теги">
          {entry.tags.map((tag, index) => <span className="tag-chip" key={`${tag}-${index}`}>#{tag}</span>)}
        </div>
      )}
      {entry.photos.length > 0 && (
        <div className="photo-list" aria-label="Фотографии записи">
          {entry.photos.map((photo, index) => (
            <img
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
        <button className="button button-secondary" type="button" onClick={() => onEdit(entry.id)}>
          Редактировать
        </button>
        <button className="button button-danger" type="button" onClick={() => onDelete(entry.id)}>
          Удалить
        </button>
      </div>
    </article>
  )
}

export default memo(EntryItem)
