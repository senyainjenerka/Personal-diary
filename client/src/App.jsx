import './App.css'
import EntryManager from './components/EntryManager.jsx'

function App() {
  return (
    <main className="app-shell">
      <header className="app-header">
        <p className="eyebrow">Личное пространство</p>
        <h1>Дневник</h1>
        <p className="intro">Сохраняйте моменты, мысли и планы — только на этом устройстве.</p>
      </header>
      <EntryManager />
      <footer className="app-footer">Ваши записи хранятся локально в браузере.</footer>
    </main>
  )
}

export default App
