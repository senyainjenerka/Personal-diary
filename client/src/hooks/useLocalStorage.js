import { useEffect, useState } from 'react'
import { readJSON, writeJSON } from '../utils/storage.js'

export default function useLocalStorage(key, initialValue) {
  // Читаем до первого рендера: иначе эффект сохранения мог бы затереть сохранённые данные начальным значением.
  const [value, setValue] = useState(() => readJSON(key, initialValue))

  useEffect(() => {
    writeJSON(key, value)
  }, [key, value])

  return [value, setValue]
}
