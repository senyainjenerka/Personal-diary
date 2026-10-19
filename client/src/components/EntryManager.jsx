import { useCallback, useEffect, useMemo, useState } from 'react'
import initialEntries from '../data/initialEntries.js'
import useLocalStorage from '../hooks/useLocalStorage.js'
import EntryForm from './EntryForm.jsx'
import EntryItem from './EntryItem.jsx'
import Filters from './Filters.jsx'
import Stats from './Stats.jsx'

function EntryManager() {
  const [entries, setEntries] = useLocalStorage('diary:entries', initialEntries)
  const [editingId, setEditingId] = useState(null)
  const [search, setSearch] = useState('')
  const [privacyFilter, setPrivacyFilter] = useState('all')
  const [sortBy, setSortBy] = useState('date-desc')
  const [isLoading, setIsLoading] = useState(true)
  const editingEntry = entries.find((entry) => entry.id === editingId) ?? null

  // Данные уже прочитаны из localStorage; задержка нужна только для имитации сервера в лабораторной.
  useEffect(() => {
    const timeoutId = window.setTimeout(() => setIsLoading(false), 1000)
    return () => window.clearTimeout(timeoutId)
  }, [])

  useEffect(() => {
    // Сохраняем заголовок, чтобы вернуть его при смене количества записей и размонтировании.
    const previousTitle = document.title
    document.title = `Дневник (${entries.length})`
    return () => {
      document.title = previousTitle
    }
  }, [entries.length])

  const addEntry = useCallback((entry) => {
    setEntries((previousEntries) => [...previousEntries, { ...entry, id: Date.now() }])
  }, [setEntries])

  const updateEntry = useCallback((entry) => {
    setEntries((previousEntries) =>
      previousEntries.map((currentEntry) =>
        currentEntry.id === entry.id ? entry : currentEntry,
      ),
    )
    setEditingId(null)
  }, [setEntries])

  const saveEntry = useCallback((entry) => {
    if (editingId === null) {
      addEntry(entry)
      return
    }
    updateEntry({ ...entry, id: editingId })
  }, [addEntry, editingId, updateEntry])

  const deleteEntry = useCallback((id) => {
    if (!window.confirm('Удалить эту запись? Это действие нельзя отменить.')) return
    setEntries((previousEntries) =>
      previousEntries.filter((entry) => entry.id !== id),
    )
    setEditingId((previousId) => (previousId === id ? null : previousId))
  }, [setEntries])

  const startEdit = useCallback((id) => {
    setEditingId(id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const cancelEdit = useCallback(() => {
    setEditingId(null)
  }, [])

  const resetDemo = useCallback(() => {
    if (!window.confirm('Заменить все записи четырьмя демо-записями?')) return
    setEntries(initialEntries)
    setEditingId(null)
    setSearch('')
    setPrivacyFilter('all')
    setSortBy('date-desc')
  }, [setEntries])

  const visibleEntries = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase('ru-RU')
    const filteredEntries = entries.filter((entry) => {
      const matchesPrivacy =
        privacyFilter === 'all' ||
        (privacyFilter === 'private' && entry.isPrivate) ||
        (privacyFilter === 'public' && !entry.isPrivate)
      const searchableText = [
        entry.title,
        entry.content,
        entry.location,
        ...entry.tags,
      ]
        .join(' ')
        .toLocaleLowerCase('ru-RU')
      return matchesPrivacy && searchableText.includes(normalizedSearch)
    })

    return filteredEntries.sort((first, second) => {
      if (sortBy === 'title') {
        const titleOrder = first.title.localeCompare(second.title, 'ru-RU')
        return titleOrder || second.id - first.id
      }

      const dateOrder = first.date.localeCompare(second.date)
      if (dateOrder !== 0) {
        return sortBy === 'date-asc' ? dateOrder : -dateOrder
      }
      return second.id - first.id
    })
  }, [entries, privacyFilter, search, sortBy])

  const stats = useMemo(() => {
    const moodCounts = entries.reduce((counts, entry) => {
      if (entry.mood) counts[entry.mood] = (counts[entry.mood] ?? 0) + 1
      return counts
    }, {})
    const mostFrequentMood = Object.entries(moodCounts).sort(
      ([firstMood, firstCount], [secondMood, secondCount]) =>
        secondCount - firstCount || firstMood.localeCompare(secondMood, 'ru-RU'),
    )[0]?.[0]
    const wordCount = entries.reduce((total, entry) => {
      const words = entry.content.trim().split(/\s+/u).filter(Boolean)
      return total + words.length
    }, 0)

    return {
      total: entries.length,
      privateCount: entries.filter((entry) => entry.isPrivate).length,
      publicCount: entries.filter((entry) => !entry.isPrivate).length,
      mostFrequentMood,
      wordCount,
    }
  }, [entries])

  return (
    <>
      <section className="panel" aria-labelledby="form-heading">
        <div className="section-heading">
          <div>
            <h2 id="form-heading">{editingEntry ? 'Редактировать запись' : 'Новая запись'}</h2>
            <p>{editingEntry ? 'Измените запись и сохраните обновления.' : 'Добавьте сегодняшний момент в дневник.'}</p>
          </div>
          <button className="button button-secondary" type="button" onClick={resetDemo}>
            Сбросить демо-данные
          </button>
        </div>
        {/* key создаёт форму с актуальным начальным состоянием при переходе между режимами. */}
        <EntryForm
          key={editingId ?? 'new'}
          entry={editingEntry}
          onSave={saveEntry}
          onCancel={cancelEdit}
        />
      </section>

      <Stats stats={stats} />

      <section aria-labelledby="entries-heading">
        <div className="list-heading">
          <h2 id="entries-heading">Записи</h2>
          <span className="muted">{entries.length} всего</span>
        </div>
        <Filters
          search={search}
          onSearchChange={setSearch}
          privacyFilter={privacyFilter}
          onPrivacyFilterChange={setPrivacyFilter}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
        <p className="counter-line">
          <span>Найдено <strong>{visibleEntries.length}</strong> из <strong>{entries.length}</strong></span>
        </p>

        {isLoading ? (
          <div className="loading-state" role="status">Загрузка записей...</div>
        ) : entries.length === 0 ? (
          <div className="empty-state">
            <strong>Записей пока нет</strong>
            Добавьте первую запись или восстановите демо-данные.
          </div>
        ) : visibleEntries.length === 0 ? (
          <div className="empty-state">
            <strong>Ничего не найдено по фильтрам</strong>
            Попробуйте изменить поисковый запрос или фильтр приватности.
          </div>
        ) : (
          <div className="entry-list">
            {visibleEntries.map((entry) => (
              <EntryItem
                key={entry.id}
                entry={entry}
                onEdit={startEdit}
                onDelete={deleteEntry}
              />
            ))}
          </div>
        )}
      </section>
    </>
  )
}

export default EntryManager
