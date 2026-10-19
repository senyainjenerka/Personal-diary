const moodLabels = {
  happy: 'Радостное',
  calm: 'Спокойное',
  neutral: 'Нейтральное',
  focused: 'Сосредоточенное',
  excited: 'Воодушевлённое',
  tired: 'Усталое',
  sad: 'Грустное',
}

function Stats({ stats }) {
  const items = [
    ['Всего записей', stats.total],
    ['Приватных', stats.privateCount],
    ['Публичных', stats.publicCount],
    ['Частое настроение', moodLabels[stats.mostFrequentMood] ?? '—'],
    ['Слов в дневнике', stats.wordCount],
  ]

  return (
    <section className="panel" aria-labelledby="stats-heading">
      <div className="section-heading">
        <div>
          <h2 id="stats-heading">Статистика</h2>
          <p>Небольшой обзор вашего дневника.</p>
        </div>
      </div>
      <div className="stats-grid">
        {items.map(([label, value]) => (
          <div className="stat-card" key={label}>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

export default Stats
