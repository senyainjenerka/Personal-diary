import './App.css'
import EntryManager from './components/EntryManager.jsx'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <h1>Мой дневник</h1>
      </header>
      <EntryManager />
      <footer className="app-footer">Записи остаются только в этом браузере.</footer>
    </main>
  )
}

export default App
