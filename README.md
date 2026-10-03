# Diary REST API

REST API личного дневника на Node.js, Express и Sequelize. Данные хранятся в локальном PostgreSQL.

## Переменные окружения

Создайте `.env` на основе `.env.example`:

```env
PORT=3000
DATABASE_URL=postgresql://postgres:password@localhost:5432/diary
JWT_SECRET=длинная_случайная_строка
DEMO_USER_PASSWORD=пароль_локального_демо-пользователя
```

`.env` не коммитится. `DATABASE_URL` должен указывать на локальную базу PostgreSQL; создайте базу `diary` перед запуском миграций. `JWT_SECRET` используйте длинный и случайный. Пароль демо-пользователя задаётся только в `.env`, сид сохраняет в базе исключительно bcrypt-хеш.

## Первый запуск

Требуется Node.js 18 или новее.

```bash
npm install
npm run db:migrate
npm run db:seed
npm run dev
```

Для обычного запуска используйте `npm start`. Сбросить схему и повторно загрузить сиды можно командой `npm run db:reset`.

## Аутентификация

Зарегистрируйте аккаунт запросом `POST /auth/register` с JSON `{ "email": "you@example.com", "password": "your-password" }`, затем выполните `POST /auth/login` с теми же данными. Успешный вход возвращает `{ "token": "..." }`. Токен действует один час.

Передавайте его в заголовке `Authorization` в защищённых запросах: `Authorization: Bearer <token>`. Маршруты `/entries` и `GET /profile` требуют токен; записи доступны только их владельцу. Маршрут `/tags` остаётся публичным. После пяти неверных паролей вход блокируется на пять минут. Регистрация и вход доступны без токена.

Сид создаёт пользователя `demo@diary.local`; его пароль берётся из `DEMO_USER_PASSWORD` в `.env` и в базе хранится только в виде хеша.

## API

```bash
# Профиль с JWT
curl http://localhost:3000/profile -H "Authorization: Bearer <token>"

# Записи текущего пользователя с JWT
curl http://localhost:3000/entries -H "Authorization: Bearer <token>"

# Новая запись с фото и тегами (PowerShell использует обратные кавычки при переносе строки)
curl -X POST http://localhost:3000/entries -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -d "{\"title\":\"Поездка\",\"content\":\"Посетил новый город\",\"date\":\"2026-09-18\",\"photos\":[\"/photos/city.jpg\"],\"tags\":[\"путешествия\",\"личное\"],\"isPrivate\":true}"

# Все теги
curl http://localhost:3000/tags

# Удаление своей записи: ответ 200 и { "message": "Entry deleted successfully" }
curl -X DELETE http://localhost:3000/entries/1 -H "Authorization: Bearer <token>"
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
