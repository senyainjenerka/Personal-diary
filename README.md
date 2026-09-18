# Diary REST API

REST API личного дневника на Node.js, Express и Sequelize. Данные хранятся в PostgreSQL (Neon), а не в памяти процесса.

## Переменные окружения

Создайте `.env` на основе `.env.example`:

```env
PORT=3000
DATABASE_URL=postgresql://user:password@host/dbname?sslmode=require
```

`.env` не коммитится. `DATABASE_URL` содержит строку подключения к PostgreSQL Neon.

## Создание базы Neon

1. Откройте [neon.tech](https://neon.tech), зарегистрируйтесь и создайте проект.
2. В панели проекта откройте **Connect** и выберите Node.js или общий URI подключения.
3. Скопируйте строку вида `postgresql://...?...sslmode=require` в `.env` как `DATABASE_URL`.

## Первый запуск

Требуется Node.js 18 или новее.

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Для обычного запуска используйте `npm start`. Сбросить схему и повторно загрузить сиды можно командой `npm run db:reset`.

## API

```bash
# Приватные записи
curl "http://localhost:3000/entries?isPrivate=true"

# Новая запись с фото и тегами (PowerShell использует обратные кавычки при переносе строки)
curl -X POST http://localhost:3000/entries -H "Content-Type: application/json" -d "{\"title\":\"Поездка\",\"content\":\"Посетил новый город\",\"date\":\"2026-09-18\",\"photos\":[\"/photos/city.jpg\"],\"tags\":[\"путешествия\",\"личное\"],\"isPrivate\":true}"

# Все теги
curl http://localhost:3000/tags

# Удаление записи: ответ 200 и { "message": "Entry deleted successfully" }
curl -X DELETE http://localhost:3000/entries/1
```

Записи возвращаются вместе с `photos` и `tags`. Ошибки имеют формат `{ "error": "сообщение" }`.

## Что где лежит

| Артефакт | Путь |
| --- | --- |
| Точка входа и обработчики 404/500 | `server.js` |
| Конфигурация Sequelize и `DATABASE_URL` | `config/config.js` |
| Инициализация Sequelize и связи моделей | `models/index.js` |
| Модель записи | `models/entry.model.js` |
| Модель фото | `models/photo.model.js` |
| Модель тега | `models/tag.model.js` |
| CRUD записей и синхронизация фото/тегов | `controllers/entries.controller.js` |
| Список тегов | `controllers/tags.controller.js` |
| Маршруты записей | `routes/entries.routes.js` |
| Маршрут `GET /tags` | `routes/tags.routes.js` |
| Миграции таблиц и поля `location` | `migrations/` |
| Начальные данные | `seeders/` |
