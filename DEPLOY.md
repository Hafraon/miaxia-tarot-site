# 🚀 Інструкція по деплою MiaxiaLip

## ⚡ Швидкий деплой (5 хвилин)

### 1. Завантажити файли
```bash
# Завантажити ВСІ файли в корінь сайту
# Обов'язкові файли:
- index.html (ОНОВЛЕНИЙ)
- telegram-notify.php (ВИПРАВЛЕНИЙ)
- error_handler.php (НОВИЙ)
- .htaccess (НОВИЙ)
- test.php (НОВИЙ)
- public/track-conversion.php (ВИПРАВЛЕНИЙ)
```

### 2. Встановити права доступу
```bash
chmod 644 index.html
chmod 644 telegram-notify.php
chmod 644 error_handler.php
chmod 644 test.php
chmod 644 .htaccess
chmod 755 public/
chmod 644 public/track-conversion.php
chmod 755 ./
```

### 3. Перевірити роботу
Відкрити: `https://miaxialip.com.ua/test.php`

**Очікуваний результат:**
```json
{
  "overall_status": "success",
  "telegram_test": {
    "success": true
  }
}
```

## 🔍 Перевірка після деплою

### В консолі браузера повинно бути:
```
✅ Google Ads ініціалізовано: AW-17416940719
🚀 Telegram notification system is ready!
💡 Для тестування виконайте: testTelegram()
```

### НЕ повинно бути:
- ❌ 404 помилок на track-conversion.php
- ❌ ERR_BLOCKED_BY_CLIENT (це нормально для блокувальників)
- ❌ Google Ads помилок
- ❌ Telegram помилок

## 🧪 Тестування

### 1. Автоматичний тест
```
https://miaxialip.com.ua/test.php?action=test
```

### 2. Ручний тест форми
1. Заповнити форму на сайті
2. Натиснути "Відправити"
3. Перевірити Telegram

### 3. Тест в консолі
```javascript
testTelegram()
```

## 🛠️ Налаштування сервера

### Apache (.htaccess)
Файл `.htaccess` вже налаштований для:
- CORS
- PHP обробки
- Безпеки
- Кешування

### Nginx (якщо потрібно)
```nginx
location /telegram-notify.php {
    try_files $uri =404;
    fastcgi_pass php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}

location /test.php {
    try_files $uri =404;
    fastcgi_pass php;
    include fastcgi_params;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
}
```

## 🐛 Вирішення проблем

### Помилка: "Failed to send Telegram message"
```bash
# Перевірити інтернет з'єднання на сервері
curl -I https://api.telegram.org

# Перевірити права на запис
touch test_write.txt && rm test_write.txt

# Перевірити логи
tail -f site_errors.log
```

### Помилка: "System requirements not met"
```bash
# Перевірити PHP версію
php -v

# Перевірити розширення
php -m | grep curl
php -m | grep json

# Встановити відсутні розширення
sudo apt-get install php-curl php-json
```

### Помилка: "404 Not Found"
```bash
# Перевірити файли
ls -la *.php

# Перевірити .htaccess
cat .htaccess

# Перевірити Apache mod_rewrite
sudo a2enmod rewrite
sudo systemctl restart apache2
```

## 📱 Telegram налаштування

### Перевірити бота:
1. Відкрити чат з ботом: `@MiaxiaLipBot`
2. Написати `/start`
3. Переконатися що бот відповідає

### Перевірити Chat ID:
```php
// В telegram-notify.php
$chatId = '603047391'; // Ваш Chat ID
```

### Отримати новий Chat ID (якщо потрібно):
1. Написати боту повідомлення
2. Відкрити: `https://api.telegram.org/bot{BOT_TOKEN}/getUpdates`
3. Знайти `"chat":{"id":ВАШІ_ЦИФРИ}`

## 🔧 Технічні деталі

### Структура запитів:
```
Форма → JavaScript → telegram-notify.php → Telegram API
```

### Обробка помилок:
```
error_handler.php → site_errors.log
```

### Тестування:
```
test.php → всі компоненти
```

## ✅ Чек-лист деплою

- [ ] Файли завантажені
- [ ] Права доступу встановлені
- [ ] test.php показує success
- [ ] Консоль без помилок
- [ ] Форма працює
- [ ] Telegram отримує повідомлення
- [ ] Google Ads фіксує конверсії

## 🎯 Результат

Після успішного деплою:
- **Консоль чиста** без червоних помилок
- **Форми працюють** з Telegram сповіщеннями
- **Google Ads** правильно відстежує конверсії
- **Система стабільна** з обробкою помилок

---

**Підтримка:** Якщо виникли проблеми, перевірити `test.php` та логи `site_errors.log`
