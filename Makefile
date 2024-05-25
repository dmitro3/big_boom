#!/usr/bin/make

.PHONY : r build up down log rm

include ./scripts/init.mf
include ./scripts/utils.mf

---------------: ## Для разработки:         ---------------
r: ## Запуск/перезапуск среды разработки
	make down && make build && make log
build: # Запуск среды разработки
	${DOCKER_COMPOSE_BIN} -f docker/compose.yml -f docker/compose.dev.yml up --build -d
up: ## Запуск среды разработки (без пересборки, когда Docker образы остались прежними)
	${DOCKER_COMPOSE_BIN} -f docker/compose.yml -f docker/compose.dev.yml up -d
down: ## Остановка среды разработки
	${DOCKER_COMPOSE_BIN} -f docker/compose.yml -f docker/compose.dev.yml down
log: ## Вывод в консоль логов Docker-а
	${DOCKER_COMPOSE_BIN} -f docker/compose.yml -f docker/compose.dev.yml logs -f
rm: ## Очистка неиспользуемых объемов (при нехватке памяти)
	docker system prune --all --force --volumes
