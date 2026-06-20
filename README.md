# NelonShift

Система управления проектами и сменами для бригад и частных подрядчиков.

## Обзор

NelonShift помогает отслеживать рабочие смены, считать заработок и генерировать табели в Excel. Каждый пользователь видит только свои проекты.

**Стек:**

| Компонент | Технология |
|---|---|
| Backend | Java 21, Spring Boot 3.4, Spring Security, JPA/Hibernate |
| Frontend | Next.js 15, React 19, TypeScript, Tailwind CSS |
| БД | PostgreSQL 16 |
| Кэш | Redis 7 (refresh-токены) |
| Контейнеризация | Docker, Docker Compose |

## Возможности

- **Авторизация** — регистрация, вход, JWT в httpOnly cookies, OAuth2 (Google, Яндекс)
- **Проекты** — CRUD с фильтрацией, сортировкой, пагинацией
- **Смены** — добавление, редактирование, удаление смен по проектам
- **Статистика** — дашборд с общей сводкой, статистика по каждому проекту
- **Прогресс-бар** — автоматический расчёт количества смен относительно плана
- **Экспорт в Excel** — серверная генерация табеля по проекту
- **Адаптивный UI** — list/grid вид, корректно отображается на десктопе

## Структура проекта

```
nelonshift/
├── docker-compose.yml
├── Makefile
├── nelonshift-backend/        # Spring Boot API
│   ├── src/main/java/
│   │   └── nelon/arrive/nelonshift/
│   │       ├── controller/    # REST-контроллеры
│   │       ├── entity/        # JPA-сущности (User, Project, Shift)
│   │       ├── dto/           # Data Transfer Objects
│   │       ├── services/      # Бизнес-логика
│   │       ├── repository/    # Spring Data JPA
│   │       ├── security/      # JWT, OAuth2, SecurityConfig
│   │       └── mappers/       # MapStruct маппинг
│   ├── src/main/resources/
│   │   └── application.yml
│   ├── pom.xml
│   └── Dockerfile
└── nelonshift-frontend/       # Next.js SPA
    ├── src/
    │   ├── app/               # App Router (маршруты)
    │   ├── entities/          # Бизнес-сущности (project, shift)
    │   ├── features/          # Фичи (auth, export, forms)
    │   ├── widgets/           # Виджеты (dashboard)
    │   └── shared/            # UI-компоненты, утилиты, API
    ├── package.json
    └── Dockerfile
```

## Быстрый старт

### 1. Настройка окружения

```bash
git clone <repo-url>
cd nelonshift

# Создать .env файлы из примеров
make env
```

Отредактируй `.env` в корне проекта — заполни секреты (JWT, OAuth, reCAPTCHA).

### 2. Запуск через Docker (продакшн)

```bash
make build
make up
```

### 3. Локальная разработка

```bash
# Бэкенд + PostgreSQL + Redis в Docker, фронт локально
make dev

# В другом терминале — фронтенд
cd nelonshift-frontend
bun install
bun run dev
```

> Бэкенд не требует локальной Java — компилируется и запускается в Docker-контейнере с hot reload.

**Сервисы:**

| Сервис | URL |
|---|---|
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:8080/api/v1 |
| Swagger UI | http://localhost:8080/swagger-ui.html |
| PostgreSQL | localhost:5432 |
| Redis | localhost:6379 |

## Команды Make

| Команда | Описание |
|---|---|
| `make help` | Показать справку по командам |
| `make env` | Создать `.env` файлы из `.env.example` |
| `make dev` | Запустить dev-режим (postgres + redis + backend в Docker) |
| `make dev-down` | Остановить dev-сервисы |
| `make dev-logs` | Логи dev-сервисов |
| `make dev-rebuild` | Пересобрать backend и перезапустить |
| `make build` | Собрать все Docker-образы (продакшн) |
| `make up` | Запустить все сервисы (продакшн) |
| `make down` | Остановить все сервисы |
| `make clean` | Удалить образы и тома |
| `make ps` | Показать статус контейнеров |

## API

Базовый URL: `http://localhost:8080/api/v1`

### Auth

| Метод | Эндпоинт | Описание |
|---|---|---|
| POST | `/auth/signup` | Регистрация |
| POST | `/auth/login` | Вход |
| POST | `/auth/refresh` | Обновление токена |
| POST | `/auth/logout` | Выход |
| GET | `/auth/me` | Текущий пользователь |

### Projects

| Метод | Эндпоинт | Описание |
|---|---|---|
| GET | `/projects` | Список проектов (фильтры, сортировка, пагинация) |
| GET | `/projects/{id}` | Детали проекта |
| POST | `/projects` | Создать проект |
| PUT | `/projects/{id}` | Обновить проект |
| DELETE | `/projects/{id}` | Удалить проект (cascade) |
| GET | `/projects/{id}/stats` | Статистика по проекту |
| GET | `/projects/{id}/export/excel` | Скачать Excel-отчёт |

### Shifts

| Метод | Эндпоинт | Описание |
|---|---|---|
| GET | `/shifts?projectId={id}` | Смены проекта |
| POST | `/shifts` | Создать смену |
| PUT | `/shifts/{id}` | Обновить смену |
| DELETE | `/shifts/{id}` | Удалить смену |

### Dashboard

| Метод | Эндпоинт | Описание |
|---|---|---|
| GET | `/dashboard/stats` | Сводная статистика |

Полная документация доступна в Swagger UI: http://localhost:8080/swagger-ui.html

## Переменные окружения

Все переменные хранятся в корневом `.env` файле. Docker Compose автоматически подхватывает его и передаёт в сервисы.

### Root `.env`

| Переменная | Описание | Значение по умолчанию |
|---|---|---|
| `POSTGRES_DB` | Имя БД | `nelon_shift` |
| `POSTGRES_USER` | Пользователь БД | `admin` |
| `POSTGRES_PASSWORD` | Пароль БД | `root` |
| `APP_PORT` | Порт бэкенда | `8080` |
| `JWT_SECRET` | Секрет для JWT | — (обязательно) |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | — |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Client Secret | — |
| `YANDEX_CLIENT_ID` | Yandex OAuth Client ID | — |
| `YANDEX_CLIENT_SECRET` | Yandex OAuth Client Secret | — |
| `OAUTH2_REDIRECT_URI` | Редирект после OAuth | `http://localhost:3000/oauth2/redirect` |
| `NEXT_PUBLIC_API_URL` | URL API для фронта | `http://localhost:8080/api/v1` |
| `NEXT_PUBLIC_BACKEND_URL` | URL бэкенда для фронта | `http://localhost:8080` |
| `GOOGLE_RECAPTCHA_SITE_KEY` | reCAPTCHA v3 site key | — |

## Лицензия

MIT
