function Filters({
  search,
  onSearchChange,
  privacyFilter,
  onPrivacyFilterChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="panel filters-grid" aria-label="Фильтры записей">
      <div className="field">
        <label htmlFor="entry-search">Поиск</label>
        <input
          id="entry-search"
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Заголовок, текст, место или тег"
        />
      </div>
      <div className="field">
        <label htmlFor="privacy-filter">Приватность</label>
        <select
          id="privacy-filter"
          value={privacyFilter}
          onChange={(event) => onPrivacyFilterChange(event.target.value)}
        >
          <option value="all">Все записи</option>
          <option value="private">Приватные</option>
          <option value="public">Публичные</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor="entry-sort">Сортировка</label>
        <select id="entry-sort" value={sortBy} onChange={(event) => onSortChange(event.target.value)}>
          <option value="date-desc">Сначала новые</option>
          <option value="date-asc">Сначала старые</option>
          <option value="title">По названию А-Я</option>
        </select>
      </div>
    </div>
  )
}

export default Filters
