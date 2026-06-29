Логика приложения (сценарии)
1. Авторизация
- Регистрация → POST /auth/signup → редирект на login
- Логин → POST /auth/login → httpOnly cookies (accessToken + refreshToken)
- OAuth → полный редирект на /oauth2/authorization/google|yandex → бэк ставит cookies → редирект на фронт /oauth2/redirect
- Refresh → автоматически при 401 через interceptor → POST /auth/refresh
- Logout → POST /auth/logout → очистка cookies
2. Главный экран (Dashboard)
- Загрузка → GET /auth/me (получаем user + проекты)
- Статистика → GET /dashboard/stats (totalActiveProjects, totalEarnings, currentMonth, topProjects)
- Список проектов → GET /projects?... (с пагинацией, сортировкой, фильтрами)
3. Управление проектами
- Создать → POST /projects → { name, status, startDate, endDate }
- Редактировать → PUT /projects/{id} → частичное обновление
- Удалить → DELETE /projects/{id} → cascade удаление смен
4. Управление сменами (внутри проекта)
- Список → GET /shifts?projectId={id}
- Добавить → POST /shifts → { projectId, date, startTime, endTime, hours, basePay, ... }
- Редактировать → PUT /shifts/{id}
- Удалить → DELETE /shifts/{id}
5. Статистика проекта
- GET /projects/{id}/stats → { shiftCount, targetShiftCount, totalEarnings, hourlyRate, ... }
- Прогресс-бар: shiftCount / targetShiftCount (авто из endDate - startDate + 1)
6. Экспорт
- GET /projects/{id}/export/excel → скачивание blob