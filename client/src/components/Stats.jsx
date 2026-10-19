const moodLabels = {
  happy: 'радостно',
  calm: 'спокойно',
  neutral: 'нейтрально',
  focused: 'сосредоточенно',
  excited: 'воодушевлённо',
  tired: 'устало',
  sad: 'грустно',
}

function Stats({ stats }) {
  const items = [
    ['Записей', stats.total],
    ['Из них личных', stats.privateCount],
    ['Публичных', stats.publicCount],
    ['Слов написано', stats.wordCount],
    ['Чаще всего', moodLabels[stats.mostFrequentMood] ?? '—'],
  ]

  return (
    <section className="stats-section" aria-labelledby="stats-heading">
      <h2 id="stats-heading">На полях</h2>
      <ul className="stats-list">
        {items.map(([label, value]) => (
          <li key={label}><span>{label}:</span> <strong>{value}</strong></li>
        ))}
      </ul>
    </section>
  )
}

export default Stats
