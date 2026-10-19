export function readJSON(key, fallback) {
  try {
    const storedValue = window.localStorage.getItem(key)
    if (storedValue === null) return fallback
    return JSON.parse(storedValue)
  } catch (error) {
    console.warn(`Не удалось прочитать localStorage по ключу "${key}".`, error)
    return fallback
  }
}

export function writeJSON(key, value) {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.warn(`Не удалось сохранить данные в localStorage по ключу "${key}".`, error)
    return false
  }
}

export function removeItem(key) {
  try {
    window.localStorage.removeItem(key)
    return true
  } catch (error) {
    console.warn(`Не удалось удалить localStorage по ключу "${key}".`, error)
    return false
  }
}
