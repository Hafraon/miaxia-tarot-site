@echo off
cd /d E:\Miaxia\Site
echo 🔧 Комітимо виправлення редіректу...
git add .
git commit -m "Fix thank-you redirect: /thank-you -> /thank-you.html"
echo 🚀 Деплоїмо на GitHub...
git push origin main
echo ✅ Деплой завершено! 
echo 🧪 Тестуйте: https://miaxialip.com.ua/thank-you
echo 📄 HTML версія: https://miaxialip.com.ua/thank-you.html
pause