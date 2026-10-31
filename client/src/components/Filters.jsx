function FilterFields({
  idPrefix,
  search,
  onSearchChange,
  privacyFilter,
  onPrivacyFilterChange,
  sortBy,
  onSortChange,
}) {
  return (
    <div className="filters-grid">
      <div className="field">
        <label htmlFor={`${idPrefix}-search`}>Поиск</label>
        <input
          id={`${idPrefix}-search`}
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Заголовок, текст, место или тег"
        />
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-privacy`}>Приватность</label>
        <select
          id={`${idPrefix}-privacy`}
          value={privacyFilter}
          onChange={(event) => onPrivacyFilterChange(event.target.value)}
        >
          <option value="all">Все записи</option>
          <option value="private">Приватные</option>
          <option value="public">Публичные</option>
        </select>
      </div>
      <div className="field">
        <label htmlFor={`${idPrefix}-sort`}>Сортировка</label>
        <select
          id={`${idPrefix}-sort`}
          value={sortBy}
          onChange={(event) => onSortChange(event.target.value)}
        >
          <option value="date-desc">Сначала новые</option>
          <option value="date-asc">Сначала старые</option>
          <option value="title">По названию А-Я</option>
        </select>
      </div>
    </div>
  )
}

function Filters(props) {
  return (
    <>
      <div className="filters-desktop" aria-label="Фильтры записей">
        <FilterFields idPrefix="desktop-entry" {...props} />
      </div>
      <details className="filters-mobile" aria-label="Фильтры записей">
        <summary>Поиск и отбор</summary>
        <FilterFields idPrefix="mobile-entry" {...props} />
      </details>
    </>
  )
}

export default Filters
