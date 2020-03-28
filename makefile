.PHONY: start stop restart install uninstall

start:
	docker-compose up --detach nginx

stop:
	docker-compose down --remove-orphans --volumes --timeout 0

restart: stop start

install:
	docker-compose run --rm npm install

uninstall:
	docker-compose run --rm shell rm -rf node_modules
