# Проектные требования и синхронизация бэка
_Exported on 13/06/2026 at 11:24:31 GMT+5 from Cursor (3.7.27)_

---

**User**

в todo.txt сдлелал набросок. чего хочу от проекта

Excel выгрузка — это must-have, не убирай
прогресс бар — и показывай прогресс-бар по окончанию проекта по сменам, это очень мотивирует

пока что в целом просмотри. 
это моно репозиторий. можешь выйти из папки этой на выше и зайти в бэк. там на спринге. Задача первая переделать на 

NelonShift_API.md тоже просмотри. Там инструкция к бэку. Бекенд сейчас может быть не доделан. По все вопросам пиши. и задавай вопросы. 

Повторю. Нам нужно эндпоинты бэка синхронизировать и сделать на фронте. Будут вопросы пиши - если возражения тоже пиши. 

---

**Cursor**

Просмотрю `todo.txt`, `NelonShift_API.md` и структуру монорепозитория (фронт и бэк), чтобы понять текущее состояние и что синхронизировать.


Сверю API-слой фронта с контроллерами бэкенда.


Просмотрел `todo.txt`, `NelonShift_API.md`, фронт и Spring-бэк. Картина такая: UI в целом готов, но фронт всё ещё заточен под **старый контракт API** (json-server-подобный), а бэк — другой. Без синхронизации ничего нормально не заработает.

---

## Что уже есть

**Фронт (готово):** grid/list, сортировка, фильтры, поиск, пагинация, CRUD проектов и смен, Excel на клиенте (ExcelJS), детали проекта, NearestShift, disabled на прошлые дни.

**Бэк (по API-доку):** auth (JWT + cookies), projects, shifts, dashboard stats, project stats, Excel export, users (admin).

**Главная задача из todo:** «связать всё с бэком на Spring» — это и есть текущий блокер.

---

## Критические расхождения фронт ↔ бэк

### 1. Projects API — другой контракт

| | Фронт сейчас | Бэк (API doc) |
|---|---|---|
| Ответ | массив `TypeProjectItem[]` | `PageResponse`: `{ content, page, size, totalElements, totalPages }` |
| Пагинация | `page=1`, `limit=8` | `page=0`, `size=10` |
| Сортировка | `sortBy=-created_at` | `sortBy=date`, `sortDirection=desc` |
| Поиск | `name=*search*` | `name=search` (LIKE на бэке) |
| Даты | `dateRange: { from, to }` | `startDate`, `endDate` |
| Timestamps | `created_at`, `updated_at` | `createdAt`, `updatedAt` |

Плюс фронт делает **два запроса** (все + пагинированные) — на Spring это лишнее.

### 2. Shifts API — другие URL

```typescript
// фронт сейчас
GET  /projects/{id}/shifts
POST /projects/{id}/shifts
PUT  /projects/{id}/shifts/{id}

// бэк
GET  /shifts?projectId={id}
POST /shifts          // projectId в body
PUT  /shifts/{id}
DELETE /shifts/{id}
```

### 3. Auth — UI есть, интеграции нет

- `LoginForm` / `RegisterForm` — формы без `onSubmit` и без вызовов API
- `axios` без `withCredentials: true` → JWT-cookies не уйдут/не придут
- Нет interceptors для refresh при 401
- reCAPTCHA, 2FA, reset password — на бэке **нет**
- OAuth (Google/Яндекс) — кнопки есть, логики нет; на бэке OAuth2 настроен

### 4. Security — сейчас всё сломано для dev без логина

В `SecurityConfig`:
- `permitAll`: только `/projects/**` и `/auth/**`
- `/shifts/**`, `/dashboard/**` — **требуют auth**

Фронт ходит в shifts без авторизации → будет 401.

При этом `createProject` на бэке вызывает `authService.getCurrentUser()` → создание проекта без логина упадёт, хотя GET projects открыт.

### 5. Эндпоинты, которые фронт не использует

| Эндпоинт | Зачем |
|---|---|
| `GET /dashboard/stats` | Статистика дашборда (сейчас считается на клиенте неверно) |
| `GET /projects/{id}/stats` | Статистика проекта + **`targetShiftCount`** для прогресс-бара |
| `GET /projects/{id}/export/excel` | Excel с бэка (сейчас генерируется на клиенте) |

### 6. Бэкенд — дыры, которых нет в API doc

- **Проекты не фильтруются по user** — `findByFilters` возвращает все проекты в БД, не только текущего пользователя
- **`targetShiftCount`** есть в entity и stats, но **нет в Create/Update Project API** → прогресс-бар не из чего считать
- Сортировка `totalPay` на фронте — на бэке такого поля нет

---

## Твои продуктовые идеи

### «Начать смену» на дашборде
Сейчас нет. Нужно уточнить UX:
- Если один активный проект → сразу форма смены?
- Если несколько → выбор проекта в модалке?
- «Начать смену» = создать смену на **сегодня** с дефолтными полями (09:00–18:00, 8ч)?

### Excel — must-have
Сейчас **клиентский** ExcelJS с захардкоженными ставками (`4000/12`, `400`, `1200`). На бэке есть `ProjectExcelService` + эндпоинт `/export/excel`.

В todo также: `Export Excel fix date` — баг с датами в клиентском экспорте (timezone/format).

**Моё мнение:** для продакшена лучше бэкенд-экспорт (единая логика, реальные суммы из БД). Клиентский можно оставить как fallback или убрать после проверки, что бэковский формат тебя устраивает.

### Прогресс-бар по сменам
Бэк уже отдаёт `shiftCount` / `targetShiftCount` в `/projects/{id}/stats`. Но:
- `targetShiftCount` нельзя задать через API при создании проекта
- На фронте прогресс-бара нет

Нужно добавить поле в форму проекта + UI (например: «48 / 60 смен — 80%»).

---

## Предлагаемый порядок работ

1. **Auth** — login/signup, cookies, guard маршрутов, refresh
2. **API-слой** — мапперы DTO, поправить projects/shifts/dashboard/stats
3. **Security на бэке** — фильтрация проектов по user; убрать `permitAll` с projects
4. **Статистика** — перейти на `/dashboard/stats` и `/projects/{id}/stats`
5. **Excel** — решить client vs server
6. **Прогресс-бар** — `targetShiftCount` в API + UI
7. **Быстрый старт** — кнопка «Начать смену» на дашборде
8. Остальное из todo (валидация дублей, push, mobile, RN)

---

## Вопросы к тебе

**Auth и доступ**
1. Делаем **обязательный логин** для всего приложения, или пока оставить dev-режим без auth?
2. OAuth (Google/Яндекс) — подключаем сейчас или только email/password?
3. reCAPTCHA, reset password, 2FA на фронте — **убираем** или оставляем заглушками?

**Excel**
4. Переходим на **бэкенд-экспорт** (`/projects/{id}/export/excel`) или чиним **клиентский**?
5. Формат Excel на бэке совпадает с тем, что сейчас на фронте (табель с формулами), или бэковский другой?

**Прогресс-бар**
6. `targetShiftCount` — пользователь задаёт при создании проекта, или считаем автоматически (например, дни между `startDate` и `endDate`)?

**Быстрый старт**
7. «Начать смену» — это создать смену на сегодня с дефолтами, или что-то другое (таймер, статус «на смене»)?

**Приоритет**
8. С чего начинаем: **auth → API sync → остальное**, или сначала projects/shifts без auth (временно открыть endpoints на бэке)?

**Бэкенд**
9. Проекты должны быть **только у текущего user** — это ожидаемое поведение? (сейчас на бэке все видят все)

---

## Возражения / замечания

- **Auth-first** — без него shifts и dashboard не работают; временный `permitAll` на shifts — костыль, не для продакшена.
- **Два Excel** — дублирование логики; лучше один источник правды.
- **`payPerShift` на фронте** — баг: `reduce` возвращает последний `basePay`, не среднее; после перехода на `/projects/{id}/stats` это уйдёт.
- **`totalPay` в сортировке** — на бэке нет; либо убрать с UI, либо добавить на бэк.

Когда ответишь на вопросы — могу начать с конкретного шага (auth + синхронизация API-слоя).

---

**User**






Делаем обязательный логин с OAuth (Google/Яндекс
reCAPTCHA тоже делаем все делаем reset password, 2FA на фронте
Переходим на бэкенд-экспорт - потом решим
targetShiftCount получаем автоматом из бека он считает вроде бы. 
про Быстрый старт - давай забудем
Приоритет как ты описал
только у текущего user должно быть видимость. бэк нужно много где фиксить и исходить как будет складываться у нас на фронте. ты главное говори что где принимать и что возвращать
payPerShift тогда убираем нафиг. все что ты скажешь с точки зрения ux
totalPay в сортировке - добавим

какие еще вопросы? или все понятно?

---

**Cursor**

Проверю бэкенд по твоим решениям: как считается `targetShiftCount`, что уже есть для OAuth, reCAPTCHA, reset password и 2FA.


Почти всё понятно — можно начинать. Ниже зафиксированный контракт, UX-решения и **5 вопросов**, без которых auth-часть заблокирована.

---

## Одна правка по `targetShiftCount`

Сейчас бэк **не считает** его автоматически — читает поле из БД, которое нигде не заполняется (всегда `null`).

**Предлагаю на бэке при create/update проекта:**
```
targetShiftCount = days между startDate и endDate + 1
```
(календарные дни; если дат нет → `null`, прогресс-бар не показываем)

Подтверди формулу — или скажи другую (только рабочие дни, фиксированное число и т.д.).

---

## Контракт: что фронт шлёт / что получает

### Auth (базовый слой — фаза 1)

| Действие | Request | Response |
|---|---|---|
| Signup | `POST /auth/signup` `{ email, name, password, recaptchaToken }` | `{ message }` |
| Login | `POST /auth/login` `{ email, password, recaptchaToken? }` | `{ id, email, name, requires2fa?: boolean }` + cookies |
| 2FA verify | `POST /auth/2fa/verify` `{ code }` | `{ id, email, name }` + cookies |
| Refresh | `POST /auth/refresh` (пусто) | `{ message }` + новый access cookie |
| Logout | `POST /auth/logout` | `{ message }` |
| Me | `GET /auth/me` | `{ id, email, name, projects: ProjectDto[] }` |
| OAuth Google | редирект на `http://localhost:8080/oauth2/authorization/google` | редирект на фронт + cookies (см. ниже) |
| OAuth Yandex | `.../oauth2/authorization/yandex` | то же |

**Фронт:** `axios` с `withCredentials: true`, interceptor на 401 → `/auth/refresh` → retry.

**Важно:** сейчас OAuth кладёт `token` в query (`/oauth2/redirect?token=...`), а email-login — в httpOnly cookies. Нужно **привести к cookies** (как login), иначе два разных механизма. Согласен?

### Reset password (новое на бэке)

| Действие | Request | Response |
|---|---|---|
| Забыл пароль | `POST /auth/forgot-password` `{ email, recaptchaToken }` | `{ message }` (всегда 200, без утечки email) |
| Новый пароль | `POST /auth/reset-password` `{ token, password }` | `{ message }` |

Фронт: `/auth/reset-password` → письмо → `/auth/new-password?token=...`

### 2FA (новое на бэке)

| Действие | Request | Response |
|---|---|---|
| Включить | `POST /auth/2fa/setup` | `{ qrCodeUrl, secret }` |
| Подтвердить | `POST /auth/2fa/enable` `{ code }` | `{ message }` |
| Отключить | `POST /auth/2fa/disable` `{ code }` | `{ message }` |

Login при включённом 2FA: первый шаг → `{ requires2fa: true }` без cookies; второй шаг `/auth/2fa/verify` → cookies.

---

### Projects

**Фронт шлёт (список):**
```
GET /projects?name=&status=ACTIVE&page=0&size=8&sortBy=date&sortDirection=desc
```

**Фронт получает:**
```json
{
  "content": [{
    "id": 1,
    "name": "...",
    "status": "ACTIVE",
    "startDate": "2026-01-01",
    "endDate": "2026-06-30",
    "totalPay": 192000.00,
    "shiftCount": 48,
    "createdAt": "...",
    "updatedAt": "..."
  }],
  "page": 0, "size": 8, "totalElements": 25, "totalPages": 4, "first": true, "last": false
}
```

**Create:**
```json
{ "name": "...", "status": "ACTIVE", "startDate": "2026-01-01", "endDate": "2026-06-30" }
```

**Update:** те же поля, все optional.

**Маппинг на фронте:** `startDate/endDate` → `dateRange.from/to`, `createdAt` → `created_at` (или переименуем типы в camelCase — лучше второе).

**Бэк фиксы:**
- фильтр `WHERE user_id = currentUser` везде
- ownership-check на get/update/delete
- `sortBy=totalPay` — сортировка по сумме смен
- `totalPay` + `shiftCount` в `ProjectDto` для списка
- убрать `permitAll` с `/projects/**`

---

### Shifts

| Действие | Request | Response |
|---|---|---|
| Список | `GET /shifts?projectId=1` | `ShiftDto[]` |
| Создать | `POST /shifts` `{ projectId, date, startTime?, endTime?, hours, basePay?, overtimeHours?, overtimePay?, perDiem? }` | `ShiftDto` |
| Обновить | `PUT /shifts/{id}` (поля optional) | `ShiftDto` |
| Удалить | `DELETE /shifts/{id}` | `{ message }` |

**ShiftDto для фронта:**
```json
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
```

`projectId` в ответе не нужен — фронт знает из контекста. `compensation` — итог с бэка, не считаем на клиенте.

---

### Stats

**Дашборд** — `GET /dashboard/stats` (как в API doc, без клиентских подсчётов).

**Проект** — `GET /projects/{id}/stats`:
```json
{
  "period": "01.01.2026 – 30.06.2026",
  "shiftCount": 48,
  "targetShiftCount": 60,
  "totalEarnings": 192000.00,
  "totalHours": 384,
  "hourlyRate": 500.00,
  "basePayPercentage": 75,
  "overtimePayPercentage": 15,
  "perDiemPercentage": 10
}
```

**Excel** — `GET /projects/{id}/export/excel` → blob, скачивание на фронте.

---

## UX-решения (без обсуждения, если не возражаешь)

1. **`payPerShift` убираем** — вместо него карточка «Ставка ₽/час» из `hourlyRate` в stats.
2. **Прогресс-бар** на странице проекта: `shiftCount / targetShiftCount` (например «48 / 60 смен · 80%»). Если `targetShiftCount === null` — только число смен, без бара.
3. **Обязательный логин** — неавторизованный → `/auth/login`, после входа → `/dashboard`.
4. **Дашборд** — stats только с `/dashboard/stats`, не из списка проектов.
5. **Сортировка «По прибыли»** — `sortBy=totalPay`, данные из `ProjectDto.totalPay`.
6. **Даты проекта** — в форме `startDate`/`endDate`, не вычислять из смен при edit (сейчас баг: edit подставляет min/max дат смен вместо дат проекта).
7. **OAuth-кнопки** — полный редирект на бэк, не popup.
8. **reCAPTCHA** — на login, signup, forgot-password (не на каждый refresh).

---

## Порядок работ (как договорились)

1. Auth: login/signup/cookies/me/guard + OAuth на cookies  
2. API sync: projects, shifts, мапперы типов  
3. Бэк: user-scoping, security, `totalPay` sort  
4. Stats + Excel с бэка  
5. Прогресс-бар + `targetShiftCount` авторасчёт  
6. reCAPTCHA + reset password + 2FA (новые эндпоинты на бэке)

---

## 5 вопросов — без них auth не закрыть

1. **`targetShiftCount`** — ок формула `endDate - startDate + 1` календарных дней?

2. **2FA** — TOTP (Google Authenticator / Яндекс.Ключ) или код на email?

3. **Reset password** — какой email-провайдер? (SMTP свой, SendGrid, Resend, Mailgun — или пока заглушка с логом в консоль для dev?)

4. **OAuth** — приводим к httpOnly cookies (как login), убираем `?token=` из URL?

5. **reCAPTCHA** — v2 (чекбокс, как сейчас на фронте) или v3 (невидимая)?

На остальное ответов достаточно — после этих пяти могу начинать с auth + синхронизации API.

---

**User**

я согласен со всем. 
1. да вроде норм. давай
2. код на имэейл
3. SMTP свой наверное. 
4. OAuth да. убираем из query
5. v3 наверное. это же моднее да?) ну что лучше давай

---

**Cursor**

reCAPTCHA v3 — лучший выбор для вашего кейса: невидимая проверка, без чекбокса. Фиксирую решения и начинаю с auth-фундамента (cookies, axios, OAuth без query).


Начинаю с бэкенда: OAuth на cookies, user-scoping и фронтовый auth-слой.


Создаю фронтовый auth-слой.


Всё зафиксировано, вопросов больше нет. По reCAPTCHA — **v3** правильный выбор: невидимая проверка, без чекбокса, лучше UX. На бэке проверяем `score >= 0.5` для действий `login`, `signup`, `forgot_password`.

---

## Итоговые решения

| Тема | Решение |
|---|---|
| Auth | Обязательный логин, JWT в httpOnly cookies |
| OAuth | Google + Яндекс, cookies (без `?token=`) |
| 2FA | Код на email |
| Reset password | Свой SMTP |
| reCAPTCHA | **v3** (невидимая) |
| Excel | Бэкенд-экспорт |
| `targetShiftCount` | Авто: `endDate − startDate + 1` |
| Видимость | Только проекты текущего user |
| `payPerShift` | Убираем |
| `totalPay` sort | Добавляем на бэке |

---

## Что уже сделано в коде

**Бэкенд:**
- OAuth → httpOnly cookies + refresh, редирект без query
- Убран `permitAll` с `/projects/**`
- Проекты/смены фильтруются по `user_id`
- `targetShiftCount` считается при create/update
- `ProjectDto` дополнен: `totalPay`, `shiftCount`
- Сортировка `sortBy=totalPay`

**Фронт:**
- `axios` с `withCredentials` + auto-refresh при 401
- Auth API, `AuthProvider`, `AuthGuard`
- Login / Register / OAuth кнопки подключены
- reCAPTCHA v3 (невидимая, при submit)
- Страница `/oauth2/redirect`
- ProfileButton с реальным user + logout

---

## Следующий шаг (фаза 2)

1. **Синхронизация API** — projects/shifts: URL, пагинация, camelCase типы
2. **Stats + Excel** — `/dashboard/stats`, `/projects/{id}/stats`, blob-скачивание
3. **UX** — прогресс-бар, убрать `payPerShift`, починить даты в форме проекта
4. **Фаза 1b на бэке** — reCAPTCHA v3 verify, email 2FA, SMTP reset

Для SMTP понадобятся в `.env` бэка: `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`, `SMTP_FROM`. Можешь скинуть когда будут готовы — подключу в следующей итерации.

Продолжаем с синхронизации projects/shifts API?

