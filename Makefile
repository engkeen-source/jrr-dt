.PHONY: install dev build clean

install:
	cd backend && npm install && npx playwright install chromium
	cd frontend && npm install

dev:
	@echo "Clearing ports..."
	@lsof -ti :3001 | xargs kill -9 2>/dev/null || true
	@lsof -ti :3000 | xargs kill -9 2>/dev/null || true
	@echo "Starting backend and frontend..."
	@trap 'kill %1 %2 2>/dev/null; exit' INT TERM; \
	cd backend && npm run dev & \
	cd frontend && npm run dev & \
	wait

build:
	cd backend && npm run build
	cd frontend && npm run build

clean:
	rm -rf backend/node_modules backend/dist
	rm -rf frontend/node_modules frontend/.next
