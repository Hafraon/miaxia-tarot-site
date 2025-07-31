<?php
// Підключаємо обробник помилок
require_once 'error_handler.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Обробка preflight запитів
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
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
            'content' => http_build_query($data),
            'timeout' => 30
        ]
    ];
    
    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);
    
    if ($result === false) {
        throw new Exception('Failed to send Telegram message');
    }
    
    return json_decode($result, true);
}

// Обробка POST запиту
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        if (!$input) {
            http_response_code(400);
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
        
        if (isset($input['email']) && !empty(trim($input['email']))) {
            $message .= "📧 <b>Email:</b> " . htmlspecialchars(trim($input['email'])) . "\n";
        }
        
        if (isset($input['instagram']) && !empty(trim($input['instagram']))) {
            $message .= "📷 <b>Instagram:</b> " . htmlspecialchars(trim($input['instagram'])) . "\n";
        }
        
        if (isset($input['service']) && !empty(trim($input['service']))) {
            // Переклад назв послуг на українську
            $serviceTranslations = [
                'individual' => '1 питання (100 грн)',
                'love' => 'Любовний прогноз (350 грн)',
                'career' => 'Кар\'єра і фінанси (400 грн)',
                'full' => '"Про себе" - 6 питань (500 грн)',
                'relationship' => '"Стосунки" - 6 питань (450 грн)',
                'business' => '"Бізнес" - 6 питань (450 грн)',
                'matrix' => 'Персональна матриця (650 грн)',
                'compatibility' => 'Матриця сумісності (600 грн)',
                'year' => 'Аркан на рік (600 грн)',
                
                // Українські назви
                'Індивідуальний розклад' => 'Індивідуальний розклад',
                'Любовний прогноз' => 'Любовний прогноз',
                'Кар\'єра і фінанси' => 'Кар\'єра і фінанси',
                'Повний розклад' => 'Повний розклад',
                'Інше' => 'Індивідуальна консультація'
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
        
        // Показувати повідомлення тільки якщо воно є
        if (isset($input['message']) && !empty(trim($input['message']))) {
            $message .= "\n💬 <b>Додаткова інформація:</b>\n" . htmlspecialchars(trim($input['message'])) . "\n";
        }
        
        $message .= "\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━";
        $message .= "\n🌐 <b>Сайт:</b> miaxialip.com.ua";
        $message .= "\n📅 <b>Дата подачі:</b> " . date('d.m.Y H:i:s');
        
        // Відправка повідомлення
        $result = sendTelegramMessage($botToken, $chatId, $message);
        
        if ($result && isset($result['ok']) && $result['ok']) {
            http_response_code(200);
            echo json_encode(['success' => true, 'message' => 'Повідомлення відправлено']);
        } else {
            http_response_code(500);
            echo json_encode(['success' => false, 'error' => 'Помилка відправки Telegram', 'details' => $result]);
        }
        
    } catch (Exception $e) {
        safe_error_log("Telegram notify error: " . $e->getMessage());
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Внутрішня помилка сервера']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Тільки POST запити дозволені']);
}
?>