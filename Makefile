# Load environment variables from .env
ifneq (,$(wildcard .env))
    include .env
    # Export variables defined in .env
    export $(shell sed 's/=.*//' .env)
endif

# Default port (can be overridden with PORT env var)
PORT ?= 5000

# Default port (can be overridden with PORT env var)
.PHONY: build
build:
	# Build the Docker image.
	docker build -t application-portfolio .

.PHONY: up
up:
	# Start the application using docker-compose with build.
	docker-compose up -d --build

.PHONY: down
down:
	# Stop and remove the 'portfolio' container, ignore errors, and bring down compose.
	- docker stop portfolio || true
	- docker rm portfolio || true
	- docker-compose down

.PHONY: run-dev
run-dev:
	# Run the container in development mode (hot-reload).
	docker run -d \
		-p $(PORT):$(PORT) \
		--name portfolio \
		-v $(PWD)/app/:/app \
		-e FLASK_APP=app.py \
		-e FLASK_ENV=development \
		application-portfolio

.PHONY: run-prod
run-prod:
	# Run the container in production mode.
	docker run -d \
		-p $(PORT):$(PORT) \
		--name portfolio \
		application-portfolio

.PHONY: logs
logs:
	# Display the logs of the 'portfolio' container.
	docker logs -f portfolio

.PHONY: dev
dev:
	# Start the application in development mode using docker-compose.
	FLASK_ENV=development docker-compose up -d

.PHONY: prod
prod:
	# Start the application in production mode using docker-compose (with build).
	docker-compose up -d --build

.PHONY: cleanup
cleanup:
	# Remove all stopped Docker containers to reclaim space.
	docker container prune -f

.PHONY: delete
delete:
	# Force remove the 'portfolio' container if it exists.
	- docker rm -f portfolio

.PHONY: browse
browse:
	# Open the application in the browser at http://localhost:$(PORT)
	chromium http://localhost:$(PORT)

npm-install:
	cd app && npm install

test: npm-install
	cd app && npx cypress run --spec "cypress/e2e/**/*.spec.js"
