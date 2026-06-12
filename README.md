# Task Management System API

REST API для управления задачами на NestJS с JWT-аутентификацией и ролями `USER` / `ADMIN`.

## Технологии

- NestJS
- TypeScript
- PostgreSQL
- Prisma ORM
- JWT + Passport
- bcrypt
- class-validator

## Возможности

- Регистрация и вход пользователей
- JWT-защита маршрутов
- RBAC: пользователь работает только со своими задачами, администратор — со всеми пользователями и задачами
- CRUD для задач
- Валидация входных данных (DTO + ValidationPipe)
- Единый формат успешных ответов и ошибок
- Логирование (login, create/delete task, ошибки)
- Interceptors: transform response и request timing

## Требования

- Node.js 18+
- PostgreSQL

## Запуск

### 1. Установить зависимости

```bash
npm install
```

### 2. Создать `.env` в корне проекта

```env
DATABASE_URL=postgresql://user:password@localhost:5432/task_manager
JWT_SECRET=your_secret_key_min_32_chars
PORT=3000
```

### 3. Применить миграции и сгенерировать Prisma Client

```bash
npx prisma migrate deploy
npx prisma generate
```

> `prisma generate` нужен после клонирования репозитория или изменения `schema.prisma`.

### 4. Запустить сервер

```bash
npm run start:dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

## Формат ответов

### Успешный ответ

```json
{
  "success": true,
  "data": {},
  "timestamp": "2026-06-11T18:00:00.000Z"
}
```

### Ошибка

```json
{
  "statusCode": 404,
  "message": "Task not found",
  "timestamp": "2026-06-11T18:00:00.000Z",
  "path": "/tasks/1"
}
```

## Аутентификация

После `POST /auth/login` используйте полученный токен в заголовке:

```
Authorization: Bearer <access_token>
```

## Эндпоинты

### Auth

| Method | Path | Описание | Auth |
|--------|------|----------|------|
| POST | `/auth/register` | Регистрация | — |
| POST | `/auth/login` | Вход, получение JWT | — |
| GET | `/auth/profile` | Профиль текущего пользователя | JWT |

**Register / Login body:**

```json
{
  "email": "user@example.com",
  "password": "123456"
}
```

### Users (ADMIN)

| Method | Path | Описание | Auth |
|--------|------|----------|------|
| GET | `/users` | Список всех пользователей | JWT + ADMIN |

### Tasks (JWT)

Все маршруты `/tasks` защищены JWT Guard. Без токена вернётся `401 Unauthorized`.

**Заголовок для всех запросов:**

```
Authorization: Bearer <access_token>
Content-Type: application/json
```

| Method | Path | Описание | HTTP-код |
|--------|------|----------|----------|
| GET | `/tasks` | USER: свои задачи, ADMIN: все | `200` |
| GET | `/tasks/:id` | Одна задача по id | `200` |
| POST | `/tasks` | Создать задачу | `201` |
| PATCH | `/tasks/:id` | Обновить задачу | `200` |
| DELETE | `/tasks/:id` | Удалить задачу | `200` |

**Модель задачи в ответе:**

```json
{
  "id": 1,
  "title": "Заголовок",
  "description": "Описание",
  "completed": false,
  "userId": 1,
  "createdAt": "2026-06-11T18:00:00.000Z",
  "updatedAt": "2026-06-11T18:00:00.000Z"
}
```

`userId` берётся из JWT (`sub`) автоматически — передавать в body не нужно.

---

#### `GET /tasks` — получить список задач

- **USER** — только свои задачи (`userId === sub` из токена)
- **ADMIN** — все задачи всех пользователей

**Пример ответа:**

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Моя задача",
      "description": "Описание",
      "completed": false,
      "userId": 1,
      "createdAt": "2026-06-11T18:00:00.000Z",
      "updatedAt": "2026-06-11T18:00:00.000Z"
    }
  ],
  "timestamp": "2026-06-11T18:00:00.000Z"
}
```

---

#### `GET /tasks/:id` — получить одну задачу

- **USER** — только своя задача
- **ADMIN** — любая задача

**Ошибки:**

| Код | Когда |
|-----|-------|
| `404` | Задача с таким id не существует |
| `403` | USER пытается открыть чужую задачу |
| `401` | Нет или невалидный JWT |

---

#### `POST /tasks` — создать задачу

**Body:**

```json
{
  "title": "Заголовок",
  "description": "Описание"
}
```

**Валидация:**

| Поле | Правила |
|------|---------|
| `title` | обязательное, строка, не пустое |
| `description` | обязательное, строка, не пустое |

**Пример ответа (`201 Created`):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Заголовок",
    "description": "Описание",
    "completed": false,
    "userId": 1,
    "createdAt": "2026-06-11T18:00:00.000Z",
    "updatedAt": "2026-06-11T18:00:00.000Z"
  },
  "timestamp": "2026-06-11T18:00:00.000Z"
}
```

**Ошибки:**

| Код | Когда |
|-----|-------|
| `400` | Пустой `title` / `description` или неверный формат body |
| `401` | Нет JWT |

---

#### `PATCH /tasks/:id` — обновить задачу

Все поля опциональны — можно передать одно или несколько.

**Body:**

```json
{
  "title": "Новый заголовок",
  "description": "Новое описание",
  "completed": true
}
```

**Права:**

- **USER** — только свои задачи
- **ADMIN** — редактировать чужие задачи **нельзя** (только свои)

**Ошибки:**

| Код | Когда |
|-----|-------|
| `404` | Задача не найдена |
| `403` | USER пытается изменить чужую задачу |
| `400` | Невалидные данные (например, `completed` не boolean) |
| `401` | Нет JWT |

---

#### `DELETE /tasks/:id` — удалить задачу

**Права:**

- **USER** — только свои задачи
- **ADMIN** — любая задача

**Пример ответа:**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Заголовок",
    "description": "Описание",
    "completed": false,
    "userId": 1,
    "createdAt": "2026-06-11T18:00:00.000Z",
    "updatedAt": "2026-06-11T18:00:00.000Z"
  },
  "timestamp": "2026-06-11T18:00:00.000Z"
}
```

**Ошибки:**

| Код | Когда |
|-----|-------|
| `404` | Задача не найдена |
| `403` | USER пытается удалить чужую задачу |
| `401` | Нет JWT |

## Роли

| Роль | Права |
|------|-------|
| **USER** | CRUD только своих задач |
| **ADMIN** | Просмотр всех пользователей и задач, удаление любой задачи |

По умолчанию при регистрации назначается роль `USER`. Роль `ADMIN` можно задать вручную через Prisma Studio:

```bash
npx prisma studio
```

## Структура проекта

```
src/
├── auth/           # register, login, JWT, roles guard
├── users/          # users service/repository, GET /users
├── tasks/          # tasks CRUD, ownership / RBAC
├── prisma/         # PrismaService, PrismaModule
├── common/
│   ├── filters/    # GlobalExceptionFilter
│   └── interceptors/  # TransformInterceptor, TimingInterceptor
├── app.module.ts
└── main.ts
prisma/
├── schema.prisma
└── migrations/
generated/
└── prisma/         # сгенерированный Prisma Client
```

## Скрипты

| Команда | Описание |
|---------|----------|
| `npm run start:dev` | Запуск в режиме разработки |
| `npm run build` | Сборка проекта |
| `npm run start:prod` | Запуск production-сборки |
| `npx prisma migrate deploy` | Применить миграции |
| `npx prisma generate` | Сгенерировать Prisma Client |
| `npx prisma studio` | GUI для работы с БД |
