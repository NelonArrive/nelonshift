# LunchShift API Documentation

Base URL: `/api/v1` (prefix из `application.yml`)  
Auth: JWT в httpOnly cookie. После `/auth/login` кука `accessToken` ставится автоматически.

---

## 🔐 AUTH

### POST `/auth/signup`
Регистрация нового пользователя.

**Request body:**
```json
{
  "email": "user@example.com",    // required, valid email
  "name": "Иван Иванов",          // required, 2–50 chars
  "password": "secret123"         // required, 6–40 chars
}
```

**Response `200`:**
```json
{
  "message": "User registered successfully"
}
```

---

### POST `/auth/login`
Вход. Устанавливает httpOnly cookie с accessToken и refreshToken.

**Request body:**
```json
{
  "email": "user@example.com",   // required
  "password": "secret123"        // required
}
```

**Response `200`:**
```json
{
  "id": "uuid-v4",
  "email": "user@example.com",
  "name": "Иван Иванов"
}
```

---

### POST `/auth/refresh`
Обновление access токена через refreshToken (из cookie).  
Тело запроса не нужно.

**Response `200`:**
```json
{
  "message": "Token refreshed successfully"
}
```

---

### POST `/auth/logout`
Выход. Инвалидирует токены, очищает cookies.  
Тело запроса не нужно.

**Response `200`:**
```json
{
  "message": "Logged out successfully"
}
```

---

### GET `/auth/me`
Текущий авторизованный пользователь.

**Response `200`:**
```json
{
  "id": "uuid-v4",
  "email": "user@example.com",
  "name": "Иван Иванов",
  "projects": [
    {
      "id": 1,
      "name": "Проект Alpha",
      "status": "ACTIVE",
      "startDate": "2026-01-01",
      "endDate": "2026-06-30",
      "createdAt": "2026-01-01T10:00:00",
      "updatedAt": "2026-03-15T12:00:00"
    }
  ]
}
```

---

## 👤 USERS

### GET `/users/all`
Список всех пользователей (admin).

**Response `200`:**
```json
[
  {
    "id": "uuid-v4",
    "email": "user@example.com",
    "name": "Иван Иванов",
    "projects": [ ...ProjectDto ]
  }
]
```

---

### GET `/users/{userId}`
Получить пользователя по UUID.

**Path param:** `userId` — UUID

**Response `200`:**
```json
{
  "id": "uuid-v4",
  "email": "user@example.com",
  "name": "Иван Иванов",
  "projects": [ ...ProjectDto ]
}
```

---

### PUT `/users/{userId}`
Обновить имя пользователя.

**Path param:** `userId` — UUID

**Request body:**
```json
{
  "name": "Новое Имя"
}
```

**Response `200`:** `UserDto` (см. GET /users/{userId})

---

### DELETE `/users/{userId}`
Удалить пользователя.

**Path param:** `userId` — UUID

**Response `200`:**
```json
{
  "message": "User deleted successfully"
}
```

---

## 📁 PROJECTS

### GET `/projects`
Список проектов текущего пользователя с фильтрацией и пагинацией.

**Query params:**
| Param | Type | Default | Description |
|---|---|---|---|
| `name` | string | — | Фильтр по имени (optional) |
| `status` | enum | — | `ACTIVE` / `COMPLETED` / `PLANNED` |
| `page` | int | `0` | Номер страницы |
| `size` | int | `10` | Размер страницы |
| `sortBy` | string | `date` | Поле сортировки |
| `sortDirection` | string | `desc` | `asc` / `desc` |

**Response `200`:**
```json
{
  "content": [
    {
      "id": 1,
      "name": "Проект Alpha",
      "status": "ACTIVE",
      "startDate": "2026-01-01",
      "endDate": "2026-06-30",
      "createdAt": "2026-01-01T10:00:00",
      "updatedAt": "2026-03-15T12:00:00"
    }
  ],
  "page": 0,
  "size": 10,
  "totalElements": 25,
  "totalPages": 3,
  "first": true,
  "last": false
}
```

---

### GET `/projects/{id}`
Получить проект по ID.

**Path param:** `id` — Long

**Response `200`:**
```json
{
  "id": 1,
  "name": "Проект Alpha",
  "status": "ACTIVE",
  "startDate": "2026-01-01",
  "endDate": "2026-06-30",
  "createdAt": "2026-01-01T10:00:00",
  "updatedAt": "2026-03-15T12:00:00"
}
```

---

### POST `/projects`
Создать новый проект.

**Request body:**
```json
{
  "name": "Проект Alpha",          // required, 2–100 chars
  "status": "ACTIVE",              // required: ACTIVE | COMPLETED | PLANNED
  "startDate": "2026-01-01",       // optional, LocalDate (YYYY-MM-DD)
  "endDate": "2026-06-30"          // optional, LocalDate (YYYY-MM-DD)
}
```

**Response `201`:** `ProjectDto`

---

### PUT `/projects/{id}`
Обновить проект (частичное обновление — все поля optional).

**Path param:** `id` — Long

**Request body:**
```json
{
  "name": "Новое название",        // optional, 2–100 chars
  "status": "COMPLETED",           // optional: ACTIVE | COMPLETED | PLANNED
  "startDate": "2026-01-01",       // optional
  "endDate": "2026-12-31"          // optional
}
```

**Response `200`:** `ProjectDto`

---

### DELETE `/projects/{id}`
Удалить проект (и все его смены — cascade).

**Path param:** `id` — Long

**Response `200`:**
```json
{
  "message": "Project deleted successfully"
}
```

---

### GET `/projects/{id}/stats`
Статистика по проекту.

**Path param:** `id` — Long

**Response `200`:**
```json
{
  "period": "01.01.2026 – 30.06.2026",
  "daysWorked": 45,
  "shiftCount": 48,
  "totalHours": 384,

  "totalEarnings": 192000.00,
  "totalBasePay": 144000.00,
  "totalOvertimePay": 28000.00,
  "totalPerDiem": 20000.00,

  "basePayPercentage": 75,
  "overtimePayPercentage": 15,
  "perDiemPercentage": 10,

  "hourlyRate": 500.00,
  "targetShiftCount": 60
}
```

---

### GET `/projects/{id}/export/excel`
Скачать отчёт по проекту в Excel (.xlsx).

**Path param:** `id` — Long

**Response `200`:**  
Binary file `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`  
Header: `Content-Disposition: attachment; filename="Проект_Alpha.xlsx"`

---

## 🕐 SHIFTS

### GET `/shifts`
Получить все смены проекта.

**Query params:**
| Param | Type | Required | Description |
|---|---|---|---|
| `projectId` | Long | ✅ Yes | ID проекта |

**Response `200`:**
```json
[
  {
    "id": 1,
    "date": "2026-06-01",
    "startTime": "09:00:00",
    "endTime": "18:00:00",
    "hours": 8,
    "basePay": 4000.00,
    "overtimeHours": 2,
    "overtimePay": 1500.00,
    "perDiem": 500.00,
    "compensation": 6000.00
  }
]
```

---

### POST `/shifts`
Создать смену.

**Request body:**
```json
{
  "projectId": 1,              // required
  "date": "2026-06-01",        // required, YYYY-MM-DD
  "startTime": "09:00",        // optional, HH:MM
  "endTime": "18:00",          // optional, HH:MM
  "hours": 8,                  // required, 0–24
  "basePay": 4000.00,          // optional, >= 0
  "overtimeHours": 2,          // optional, >= 0
  "overtimePay": 1500.00,      // optional, >= 0
  "perDiem": 500.00,           // optional, >= 0
  "compensation": 6000.00      // optional, >= 0
}
```

**Response `201`:** `ShiftDto`

---

### PUT `/shifts/{id}`
Обновить смену (все поля optional).

**Path param:** `id` — Long

**Request body:**
```json
{
  "date": "2026-06-02",        // optional
  "startTime": "10:00",        // optional
  "endTime": "19:00",          // optional
  "hours": 8,                  // optional, 0–24
  "basePay": 4500.00,          // optional, >= 0
  "overtimeHours": 1,          // optional, >= 0
  "overtimePay": 800.00,       // optional, >= 0
  "perDiem": 500.00,           // optional, >= 0
  "compensation": 5800.00      // optional, >= 0
}
```

**Response `200`:** `ShiftDto`

---

### DELETE `/shifts/{id}`
Удалить смену.

**Path param:** `id` — Long

**Response `200`:**
```json
{
  "message": "Shift deleted successfully"
}
```

---

## 📊 DASHBOARD

### GET `/dashboard/stats`
Сводная статистика для главного экрана.

**Response `200`:**
```json
{
  "totalActiveProjects": 3,
  "totalCompletedProjects": 7,
  "totalShifts": 124,
  "totalHours": 992,
  "totalEarnings": 496000.00,

  "currentMonthEarnings": 42000.00,
  "currentMonthShifts": 11,
  "currentMonthHours": 88,

  "topProjects": [
    {
      "id": 1,
      "name": "Проект Alpha",
      "totalEarnings": 22000.00,
      "shiftCount": 6,
      "hourlyRate": 500.00
    },
    {
      "id": 3,
      "name": "Клиент Beta",
      "totalEarnings": 15000.00,
      "shiftCount": 4,
      "hourlyRate": 625.00
    }
  ]
}
```

---

## ⚠️ ERROR RESPONSES

Все ошибки возвращают одинаковую структуру:

```json
{
  "status": 404,
  "error": "Not Found",
  "message": "Проект не найден с ID: 42",
  "timestamp": "2026-06-06T12:00:00"
}
```

| HTTP Status | Когда |
|---|---|
| `400` | Невалидный запрос / бизнес-логика |
| `401` | Не авторизован |
| `403` | Нет доступа |
| `404` | Ресурс не найден |
| `409` | Уже существует (AlreadyExists) |
| `500` | Внутренняя ошибка |

---

## 📌 Enum значения

**ProjectStatus:**
- `ACTIVE` — активный проект
- `COMPLETED` — завершённый
- `PLANNED` — запланированный

---

## 📝 Заметки

- `compensation` в смене — итоговая сумма за смену (basePay + overtimePay + perDiem). Считается на бэке, но принимается и из запроса.
- `topProjects` в дашборде — топ проектов по суммарному заработку за **текущий месяц**.
- `targetShiftCount` в `ProjectStatsDto` — плановое количество смен (поле в entity Project, но не в CreateProjectRequest — значит сейчас не выставляется через API, только внутренне).
- Все даты — ISO 8601: `YYYY-MM-DD`, время — `HH:MM` или `HH:MM:SS`.
