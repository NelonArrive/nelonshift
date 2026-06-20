build: ## Собрать все образы
	docker compose build

up: ## Запустить все сервисы
	docker compose up -d

down: ## Остановить все сервисы
	docker compose down

restart: ## Перезапустить все сервисы
	docker compose restart
