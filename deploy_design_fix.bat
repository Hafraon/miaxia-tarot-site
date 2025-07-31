@echo off
cd /d E:\Miaxia\Site
echo 🎨 Коміт: Оновлюємо дизайн сторінки подяки під основний сайт...
git add .
git commit -m "Match thank-you page design with main site - starry background, gold gradient, proper styling"
echo 🚀 Деплоїмо на GitHub...
git push origin main
echo ✅ Деплой завершено! 
echo 🎉 Сторінка подяки тепер має той самий дизайн що й основний сайт
echo 📄 Тестуйте: https://miaxialip.com.ua/thank-you.html
echo ⭐ Зоряний фон + золотий градієнт + backdrop-blur ефекти
pause