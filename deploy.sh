#!/bin/bash

echo "🚀 MiaxiaLip Deploy Script"
echo "=========================="

# Перевірка Node.js версії
echo "📋 Перевіряю Node.js..."
node --version
npm --version

# Очистка кешів
echo "🧹 Очищую кеші..."
rm -rf node_modules/.cache
rm -rf dist

# Встановлення залежностей
echo "📦 Встановлюю залежності..."
npm ci --production=false

# Виправлення вразливостей (не breaking changes)
echo "🔧 Виправляю вразливості..."
npm audit fix --only=prod || echo "⚠️ Деякі вразливості не виправлені"

# Збірка проекту
echo "🔨 Збираю проект..."
npm run build

# Перевірка результату збірки
if [ -d "dist" ]; then
    echo "✅ Збірка успішна!"
    echo "📁 Файли в dist:"
    ls -la dist/
else
    echo "❌ Помилка збірки!"
    exit 1
fi

echo "🎉 Деплой готовий!"
