@echo off
echo 🚀 MiaxiaLip Deploy Script
echo ==========================

echo 📋 Перевіряю Node.js...
node --version
npm --version

echo 🧹 Очищую кеші...
if exist node_modules\.cache rmdir /s /q node_modules\.cache
if exist dist rmdir /s /q dist

echo 📦 Встановлюю залежності...
npm ci --production=false

echo 🔧 Виправляю вразливості...
npm audit fix --only=prod

echo 🔨 Збираю проект...
npm run build

if exist dist (
    echo ✅ Збірка успішна!
    echo 📁 Файли в dist:
    dir dist
) else (
    echo ❌ Помилка збірки!
    exit /b 1
)

echo 🎉 Деплой готовий!
pause