<?php
header('Content-Type: text/html; charset=UTF-8');

function testTelegram() {
    $testData = [
        'name' => 'Тест системи',
        'phone' => '+380123456789',
        'service' => 'individual',
        'message' => 'Тестове повідомлення з ' . date('Y-m-d H:i:s')
    ];
    
    $url = $_SERVER['REQUEST_SCHEME'] . '://' . $_SERVER['HTTP_HOST'] . '/telegram-notify.php';
    
    $options = [
        'http' => [
            'header' => "Content-type: application/json\r\n",
            'method' => 'POST',
            'content' => json_encode($testData),
            'timeout' => 30
        ]
    ];
    
    $context = stream_context_create($options);
    $result = @file_get_contents($url, false, $context);
    
    if ($result === false) {
        return ['success' => false, 'error' => 'Connection failed'];
    }
    
    return json_decode($result, true);
}

$testResult = null;
if (isset($_GET['test'])) {
    $testResult = testTelegram();
}
?>
<!DOCTYPE html>
<html lang="uk">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>MiaxiaLip - Тест системи</title>
    <style>
        body { 
            font-family: 'Segoe UI', Arial, sans-serif; 
            margin: 20px; 
            background: linear-gradient(135deg, #0a1128 0%, #1e2a54 100%);
            color: #fff;
            min-height: 100vh;
        }
        .container { 
            max-width: 800px; 
            margin: 0 auto; 
            background: rgba(255, 255, 255, 0.1); 
            padding: 30px; 
            border-radius: 15px; 
            backdrop-filter: blur(10px);
            border: 1px solid rgba(212, 175, 55, 0.3);
        }
        .header { 
            text-align: center; 
            color: #d4af37; 
            margin-bottom: 30px; 
            font-size: 2rem;
        }
        .status { 
            margin: 15px 0; 
            padding: 15px; 
            border-radius: 8px; 
            font-weight: bold;
        }
        .success { 
            background: rgba(40, 167, 69, 0.2); 
            border: 1px solid #28a745; 
            color: #28a745; 
        }
        .error { 
            background: rgba(220, 53, 69, 0.2); 
            border: 1px solid #dc3545; 
            color: #dc3545; 
        }
        .info { 
            background: rgba(23, 162, 184, 0.2); 
            border: 1px solid #17a2b8; 
            color: #17a2b8; 
        }
        button { 
            background: linear-gradient(135deg, #d4af37, #f5e0a2); 
            color: #0a1128; 
            border: none; 
            padding: 12px 25px; 
            border-radius: 25px; 
            cursor: pointer; 
            margin: 8px; 
            font-weight: 600;
            transition: all 0.3s ease;
        }
        button:hover { 
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(212, 175, 55, 0.3);
        }
        .result { 
            margin-top: 20px; 
            padding: 20px; 
            background: rgba(255, 255, 255, 0.05); 
            border-radius: 8px; 
            white-space: pre-wrap; 
            font-family: 'Courier New', monospace;
        }
        .check-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }
        .check-item:last-child {
            border-bottom: none;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            🔮 MiaxiaLip - Тест системи
        </div>
        
        <div class="status info">
            <strong>📋 Системна перевірка:</strong>
            <div class="check-item">
                <span>PHP версія:</span>
                <span><?php echo PHP_VERSION; ?> <?php echo version_compare(PHP_VERSION, '7.0.0', '>=') ? '✅' : '❌'; ?></span>
            </div>
            <div class="check-item">
                <span>cURL розширення:</span>
                <span><?php echo extension_loaded('curl') ? '✅ Активно' : '❌ Відсутнє'; ?></span>
            </div>
            <div class="check-item">
                <span>JSON розширення:</span>
                <span><?php echo extension_loaded('json') ? '✅ Активно' : '❌ Відсутнє'; ?></span>
            </div>
            <div class="check-item">
                <span>Права на запис:</span>
                <span><?php echo is_writable('./') ? '✅ Є' : '❌ Немає'; ?></span>
            </div>
            <div class="check-item">
                <span>telegram-notify.php:</span>
                <span><?php echo file_exists('telegram-notify.php') ? '✅ Існує' : '❌ Відсутній'; ?></span>
            </div>
        </div>
        
        <div style="text-align: center; margin: 20px 0;">
            <button onclick="window.location.href='?test=1'">🧪 Тест Telegram</button>
            <button onclick="window.location.href='?'">🔄 Оновити</button>
            <button onclick="window.location.href='/'">🏠 На сайт</button>
        </div>
        
        <?php if ($testResult): ?>
        <div class="status <?php echo $testResult['success'] ? 'success' : 'error'; ?>">
            <strong>📡 Результат тесту Telegram:</strong>
            <?php if ($testResult['success']): ?>
                ✅ Успішно! Повідомлення відправлено в Telegram.
            <?php else: ?>
                ❌ Помилка: <?php echo htmlspecialchars($testResult['error'] ?? 'Невідома помилка'); ?>
            <?php endif; ?>
        </div>
        
        <div class="result">
Деталі тесту:
<?php echo json_encode($testResult, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE); ?>
        </div>
        <?php endif; ?>
        
        <div class="status info">
            <strong>🔧 Інструкції:</strong><br>
            • Якщо тест успішний - система працює!<br>
            • При помилках перевірте налаштування сервера<br>
            • Переконайтесь що всі файли завантажені<br>
            • Перевірте права доступу до файлів
        </div>
        
        <div style="text-align: center; margin-top: 20px; opacity: 0.7; font-size: 0.9rem;">
            <p>🌐 URL: <?php echo $_SERVER['HTTP_HOST'] . $_SERVER['REQUEST_URI']; ?></p>
            <p>⏰ Час: <?php echo date('d.m.Y H:i:s'); ?></p>
        </div>
    </div>
    
    <script>
        // Автоматичне тестування при завантаженні для діагностики
        document.addEventListener('DOMContentLoaded', function() {
            console.log('🚀 MiaxiaLip Test Page готова!');
            console.log('📍 Location:', window.location.href);
            console.log('🔧 Для тестування: натисніть "Тест Telegram"');
        });
    </script>
</body>
</html>