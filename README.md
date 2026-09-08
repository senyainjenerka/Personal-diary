# Diary REST API

REST API для управления записями личного дневника на Node.js и Express.js. Сейчас записи хранятся в массиве в памяти, поэтому после перезапуска сервера изменения сбрасываются.

## Запуск

Требуется Node.js 18 или новее.

```bash
npm install
npm run dev
```

Для обычного запуска:

```bash
npm start
```

По умолчанию сервер доступен на `http://localhost:3000`. Другой порт можно задать переменной окружения `PORT`.

## Примеры запросов

Получить все записи:

```bash
curl http://localhost:3000/entries
```

Получить только приватные записи:

```bash
curl "http://localhost:3000/entries?isPrivate=true"
```

Создать запись:

```bash
curl -X POST http://localhost:3000/entries ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Новая запись\",\"content\":\"Текст записи\",\"mood\":\"happy\",\"photos\":[],\"isPrivate\":true}"
```

Полностью обновить запись:

```bash
curl -X PUT http://localhost:3000/entries/1 ^
  -H "Content-Type: application/json" ^
  -d "{\"title\":\"Обновленный заголовок\",\"content\":\"Обновленный текст\",\"mood\":\"neutral\",\"photos\":[],\"isPrivate\":false}"
```

Удалить запись:

```bash
curl -X DELETE http://localhost:3000/entries/1
```
