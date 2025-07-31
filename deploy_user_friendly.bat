@echo off
cd /d E:\Miaxia\Site
echo 🔧 Коміт: Приховуємо Ad Blocker попередження...
git add .
git commit -m "Hide Ad Blocker warnings and debug panel for users - user-friendly thank you page"
echo 🚀 Деплоїмо на GitHub...
git push origin main
echo ✅ Деплой завершено! 
echo 🎉 Сторінка подяки тепер дружня до користувачів
echo 📄 Тестуйте: https://miaxialip.com.ua/thank-you.html
echo 🛠️ Debug режим: додайте ?debug=1 до URL
pause