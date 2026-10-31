import './App.css'
import EntryManager from './components/EntryManager.jsx'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <div className="header-deco header-deco-leaf" aria-hidden="true">🌿</div>
        <div className="header-deco header-deco-bloom" aria-hidden="true">✿</div>
        <div className="header-title">
          <p className="header-kicker">личный дневник</p>
          <h1>Мой дневник</h1>
          <p className="header-tagline">Тихие заметки о днях, настроении и мелочах</p>
        </div>
      </header>
      <EntryManager />
      <footer className="app-footer">
        <span className="footer-flower" aria-hidden="true">❀</span>
        Записи остаются только в этом браузере.
      </footer>
    </main>
  )
}

export default App
