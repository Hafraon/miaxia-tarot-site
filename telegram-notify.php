<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обробка preflight запитів
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Налаштування бота
$botToken = '7322148325:AAHWjMEFuBVVoUhsPQ6SOsSTBE2fxFZfeXU';
$chatId = '603047391'; // Ваш Chat ID

function sendTelegramMessage($botToken, $chatId, $message) {
    $url = "https://api.telegram.org/bot$botToken/sendMessage";
    
    $data = [
        'chat_id' => $chatId,
        'text' => $message,
        'parse_mode' => 'HTML'
    ];
    
    $options = [
        'http' => [
            'header' => "Content-type: application/x-www-form-urlencoded\r\n",
            'method' => 'POST',
            'content' => http_build_query($data)
        ]
    ];
    
    $context = stream_context_create($options);
    $result = file_get_contents($url, false, $context);
    
    return json_decode($result, true);
}

// Обробка POST запиту
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);
    
    if (!$input) {
        echo json_encode(['success' => false, 'error' => 'Немає даних']);
        exit;
    }
    
    // Формування повідомлення
    $message = "🔔 <b>Нове замовлення з сайту MiaxiaLip!</b>\n\n";
    
    if (isset($input['name']) && !empty(trim($input['name']))) {
        $message .= "👤 <b>Ім'я:</b> " . htmlspecialchars(trim($input['name'])) . "\n";
    }
    
    if (isset($input['phone']) && !empty(trim($input['phone']))) {
        $message .= "📱 <b>Телефон:</b> " . htmlspecialchars(trim($input['phone'])) . "\n";
    }
    
    if (isset($input['instagram']) && !empty(trim($input['instagram']))) {
        $message .= "📷 <b>Instagram:</b> " . htmlspecialchars(trim($input['instagram'])) . "\n";
    }
    
    if (isset($input['service']) && !empty(trim($input['service']))) {
        // Переклад назв послуг на українську (відповідно до реального списку)
        $serviceTranslations = [
            // З нового списку послуг
            'individual' => '1 питання - 70 грн',
            'love' => 'Любовний прогноз - 280 грн',
            'career' => 'Кар\'єра і фінанси - 350 грн',
            'full' => '"Про себе" (6 питань) - 450 грн',
            'relationship' => '"Стосунки" (6 питань) - 390 грн',
            'business' => '"Бізнес" (6 питань) - 400 грн',
            'matrix' => 'Персональна матриця - 570 грн',
            'compatibility' => 'Матриця сумісності - 550 грн',
            'year' => 'Аркан на рік - 560 грн',
            
            // Старі варіанти
            'Оберіть послугу' => 'Не вказано',
            'Індивідуальний розклад' => 'Індивідуальний розклад',
            'Любовний прогноз' => 'Любовний прогноз',
            'Кар\'єра і фінанси' => 'Кар\'єра і фінанси',
            'Повний розклад' => 'Повний розклад',
            'Інше' => 'Індивідуальна консультація',
            
            // Можливі англійські варіанти
            'Individual reading' => 'Індивідуальний розклад',
            'Love reading' => 'Любовний прогноз', 
            'Love forecast' => 'Любовний прогноз',
            'Career guidance' => 'Кар\'єра і фінанси',
            'Career and finance' => 'Кар\'єра і фінанси',
            'Full reading' => 'Повний розклад',
            'Complete reading' => 'Повний розклад',
            'Other' => 'Індивідуальна консультація',
            
            // Короткі назви
            'general' => 'Індивідуальний розклад',
            'tarot' => 'Розклад Таро',
            'consultation' => 'Консультація',
            'reading' => 'Розклад',
            
            // Додаткові можливі варіанти
            'romance' => 'Любовний прогноз',
            'money' => 'Кар\'єра і фінанси',
            'work' => 'Кар\'єра і фінанси',
            'finance' => 'Кар\'єра і фінанси',
            'financial' => 'Кар\'єра і фінанси'
        ];
        
        $serviceName = $input['service'];
        if (isset($serviceTranslations[$serviceName])) {
            $serviceName = $serviceTranslations[$serviceName];
        }
        
        $message .= "🔮 <b>Послуга:</b> " . htmlspecialchars($serviceName) . "\n";
    }
    
    // Показувати дату і час тільки якщо вони заповнені
    if (isset($input['date']) && !empty(trim($input['date']))) {
        $message .= "📅 <b>Бажана дата:</b> " . htmlspecialchars(trim($input['date'])) . "\n";
    }
    
    if (isset($input['time']) && !empty(trim($input['time']))) {
        $message .= "⏰ <b>Бажаний час:</b> " . htmlspecialchars(trim($input['time'])) . "\n";
    }
    
    // Показувати повідомлення/питання тільки якщо воно є
    if (isset($input['message']) && !empty(trim($input['message']))) {
        $message .= "\n💬 <b>Додаткова інформація:</b>\n" . htmlspecialchars(trim($input['message'])) . "\n";
    } elseif (isset($input['question']) && !empty(trim($input['question']))) {
        $message .= "\n❓ <b>Питання:</b>\n" . htmlspecialchars(trim($input['question'])) . "\n";
    }
    
    $message .= "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
    $message .= "\n🌐 <b>Сайт:</b> miaxialip.com.ua";
    $message .= "\n📅 <b>Дата подачі:</b> " . date('d.m.Y H:i:s');
    
    // Відправка повідомлення
    $result = sendTelegramMessage($botToken, $chatId, $message);
    
    if ($result && $result['ok']) {
        echo json_encode(['success' => true, 'message' => 'Повідомлення відправлено']);
    } else {
        echo json_encode(['success' => false, 'error' => 'Помилка відправки', 'details' => $result]);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Тільки POST запити']);
}
?>