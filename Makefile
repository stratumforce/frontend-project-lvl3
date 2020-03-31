install: install-deps

install-deps:
	npm ci

start:
	npm start

build:
	npm run build

lint:
	npx eslint .
