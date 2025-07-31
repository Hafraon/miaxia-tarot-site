# 📋 ІНСТРУКЦІЯ З ІМПОРТУ GTM КОНФІГУРАЦІЇ

## 📁 Файл: GTM-NVMR3CJ2_v15_enhanced.json

### 🎯 Що містить ця конфігурація:

✅ **Покращені тригери:**
- Основний тригер: `/thank-you` (Page Path)
- Альтернативний тригер: regex для URL з параметрами

✅ **Google Ads конверсії:**
- AW-7239891504/urnsCLD0n_waEK_ZhfFA (перегляд сторінки "Дякую")
- AW-17416940719/waLYCNbXjvwaEK_ZhfFA (перегляд сторінки "Дякую")

✅ **Google Analytics 4:**
- Подія `purchase` з ecommerce параметрами
- Динамічна вартість через DataLayer
- Додаткові параметри: event_category, event_label, value, currency

✅ **Спеціальні змінні:**
- DLV - conversion_value (за замовчуванням 70 грн)

✅ **Зв'язування конверсій:**
- Автоматичне відстеження кліків

---

## 🚀 ІНСТРУКЦІЯ З ІМПОРТУ:

### Крок 1: Відкрийте Google Tag Manager
1. Перейдіть на https://tagmanager.google.com
2. Оберіть контейнер `GTM-NVMR3CJ2` (miaxialip.com.ua)

### Крок 2: Імпорт конфігурації
1. В лівому меню натисніть **"Адміністрування"** (Admin)
2. Оберіть **"Імпорт контейнера"** (Import Container)
3. Натисніть **"Choose container file"**
4. Виберіть файл: `GTM-NVMR3CJ2_v15_enhanced.json`

### Крок 3: Налаштування імпорту
1. **Workspace:** Виберіть existing workspace або створіть новий
2. **Import option:** Виберіть **"Merge"** (щоб зберегти існуючі теги)
3. **Conflict resolution:** Виберіть **"Rename conflicting tags"**

### Крок 4: Перевірка конфігурації
1. **✅ Всі мітки конверсій вже налаштовані правильно:**
   - AW-7239891504: `urnsCLD0n_waEK_ZhfFA`
   - AW-17416940719: `waLYCNbXjvwaEK_ZhfFA`
2. Перевірте всі теги в розділі **"Tags"**
3. Переконайтеся що тригери налаштовані правильно
4. Перевірте змінну **"DLV - conversion_value"** для динамічної вартості

### Крок 5: Тестування
1. Натисніть **"Preview"** для входу в режим тестування
2. Перейдіть на https://miaxialip.com.ua/thank-you.html
3. Перевірте спрацьовування тегів:
   - ✅ Відстеження конверсій у Google Ads
   - ✅ Google Analytics подія
   - ✅ Зв'язування конверсій

### Крок 6: Публікація
1. Якщо все працює правильно, натисніть **"Submit"**
2. Додайте назву версії: "Enhanced conversion tracking v15"
3. Натисніть **"Publish"**

---

## ✅ ВАЖЛИВО:

### 🚀 Все готово до імпорту:
1. **✅ Мітки конверсій:** Налаштовані правильно
   - **AW-7239891504:** urnsCLD0n_waEK_ZhfFA (перегляд сторінки "Дякую")
   - **AW-17416940719:** waLYCNbXjvwaEK_ZhfFA (перегляд сторінки "Дякую")
2. **✅ Тригери:** Оптимізовані для /thank-you
3. **✅ Змінні:** Додана DLV - conversion_value
4. **✅ GA4:** Покращена подія purchase з ecommerce

### 🧪 Тестування:
- Використовуйте **GTM Preview Mode**
- Перевірте в **Google Analytics Real-Time** чи приходять події
- Перегляньте **Google Ads Conversions** через 24-48 годин

### 📊 Очікувані результати:
- События `purchase` в GA4
- Конверсії в Google Ads
- Правильне відстеження на `/thank-you`

---

## 🆘 При проблемах:

1. **Конверсії не відстежуються:**
   - Перевірте правильність міток конверсій
   - Переконайтеся що Enhanced tracking код працює в HTML

2. **Тригери не спрацьовують:**
   - Перевірте URL сторінки подяки
   - Переконайтеся що Page Path = `/thank-you`

3. **GA4 події не приходять:**
   - Перевірте Measurement ID: `G-GDEVM541ZP`
   - Подивіться Real-Time звіти в GA4

---

## 📞 Контакти для підтримки:
- Google Tag Manager Справка: https://support.google.com/tagmanager
- Google Ads Конверсії: https://support.google.com/google-ads

**ФАЙЛ ГОТОВИЙ ДО ІМПОРТУ! 🚀**

### ⚠️ ВАЖЛИВА ІНФОРМАЦІЯ:
- ✅ **Виправлена помилка:** `Error deserializing enum type [ConditionType]. Unrecognized value [REGEX]`
- ✅ **Рішення:** Видалений альтернативний тригер з regex (через проблеми сумісності GTM)
- ✅ **Залишився:** Тільки основний тригер з простою умовою `Page Path = /thank-you`
- ✅ **Результат:** JSON файл тепер має повністю сумісний формат для GTM

---

## 📋 ДОДАТКОВА ІНФОРМАЦІЯ:

### 📊 ЩО БУДЕ ВІДСТЕЖУВАТИСЯ:
1. **Google Analytics 4:**
   - Подія `purchase` з динамічною вартістю
   - Ecommerce дані (transaction_id, item_name, category)
   - Кастомні параметри (event_category, event_label)

2. **Google Ads конверсії (2 типи):**
   - **AW-7239891504:** urnsCLD0n_waEK_ZhfFA (перегляд сторінки "Дякую")
   - **AW-17416940719:** waLYCNbXjvwaEK_ZhfFA (перегляд сторінки "Дякую")

3. **Тригери:**
   - Основний: Page Path = `/thank-you` (EQUALS)
   - ❌ Альтернативний тригер з regex видалений (через проблеми сумісності)

4. **Змінні:**
   - `DLV - conversion_value` - динамічна вартість з DataLayer

### 🔍 ПЕРЕВІРКА РОБОТИ:
1. **GTM Preview Mode:** Всі теги повинні спрацювати на /thank-you
2. **GA4 Real-Time:** Події `purchase` з правильною вартістю
3. **Google Ads:** Конверсії з'являться через 24-48 годин
4. **Browser Console:** Enhanced tracking логи на thank-you сторінці

### 🛠️ ЯКЩО ДОСІ БАЧИТЕ ПОМИЛКУ З REGEX:
1. **Перезавантажте файл:** Завантажте свіжий `GTM-NVMR3CJ2_v15_enhanced.json` (без regex тригера)
2. **Очистіть кеш браузера** і спробуйте імпорт знову
3. **Перевірте:** Основний тригер з `Page Path = /thank-you` повинен працювати стабільно
4. **Моніторинг:** Перевірте спрацьовування через GTM Preview Mode