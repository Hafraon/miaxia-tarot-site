# MiaxiaLip Tarot Website Dockerfile
# Оптимізовано для Railway deployment

FROM node:18-alpine AS builder

WORKDIR /app

# Копіювати package files
COPY package*.json ./

# Встановити залежності
RUN npm ci --only=production=false

# Копіювати source код
COPY . .

# Збудувати проект
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Копіювати package files
COPY package*.json ./
COPY server.cjs ./

# Встановити тільки production залежності
RUN npm ci --only=production

# Копіювати збудований проект з builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/public ./public

# Копіювати PHP файли для API (якщо потрібні)
COPY telegram-notify.php* ./
COPY public/ ./public/

# Створити app user для безпеки
RUN addgroup -g 1001 -S nodejs && \
    adduser -S appuser -u 1001

# Встановити права доступу
RUN chown -R appuser:nodejs /app
USER appuser

# Відкрити порт
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Запустити сервер
CMD ["node", "server.cjs"]
