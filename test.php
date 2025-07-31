<?php
// Тестування системи MiaxiaLip
require_once 'error_handler.php';

header('Content-Type: application/json');

// Функція тестування Telegram
function testTelegram() {
    $testData = [
        'name' => 'Тест системи',
        'phone' => '+380123456789',
        'email' => 'test@miaxialip.com.ua',
        'instagram' => '@test_user',
        'service' => 'individual',
        'message' => 'Це тестове повідомлення з ' . date('Y-m-d H:i:s')
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

// Тестування системних вимог
function testSystemRequirements() {
    $tests = [
        'PHP Version' => [
            'test' => version_compare(PHP_VERSION, '7.0.0', '>='),
            'value' => PHP_VERSION,
            'required' => '7.0+'
        ],
        'cURL Extension' => [
            'test' => extension_loaded('curl'),
            'value' => extension_loaded('curl') ? 'Enabled' : 'Disabled',
            'required' => 'Enabled'
        ],
        'JSON Extension' => [
            'test' => extension_loaded('json'),
            'value' => extension_loaded('json') ? 'Enabled' : 'Disabled',
            'required' => 'Enabled'
        ],
        'Write Permissions' => [
            'test' => is_writable('./'),
            'value' => is_writable('./') ? 'Yes' : 'No',
            'required' => 'Yes'
        ],
        'Error Log Writable' => [
            'test' => is_writable('./') || is_writable('site_errors.log'),
            'value' => (is_writable('./') || is_writable('site_errors.log')) ? 'Yes' : 'No',
            'required' => 'Yes'
        ]
    ];
    
    return $tests;
}

// Головна функція тестування
function runAllTests() {
    $results = [
        'timestamp' => date('Y-m-d H:i:s'),
        'server_info' => [
            'PHP_VERSION' => PHP_VERSION,
            'SERVER_SOFTWARE' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'HTTP_HOST' => $_SERVER['HTTP_HOST'] ?? 'Unknown'
        ],
        'system_requirements' => testSystemRequirements(),
        'telegram_test' => null,
        'overall_status' => 'unknown'
    ];
    
    // Перевірити системні вимоги
    $systemOk = true;
    foreach ($results['system_requirements'] as $test) {
        if (!$test['test']) {
            $systemOk = false;
            break;
        }
    }
    
    if ($systemOk) {
        // Тестувати Telegram, якщо система готова
        $results['telegram_test'] = testTelegram();
        $results['overall_status'] = $results['telegram_test']['success'] ? 'success' : 'partial';
    } else {
        $results['overall_status'] = 'system_error';
        $results['telegram_test'] = ['success' => false, 'error' => 'System requirements not met'];
    }
    
    return $results;
}

// Обробка запитів
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    if (isset($_GET['action'])) {
        switch ($_GET['action']) {
            case 'test':
                echo json_encode(runAllTests(), JSON_PRETTY_PRINT);
                break;
            case 'telegram':
                echo json_encode(testTelegram(), JSON_PRETTY_PRINT);
                break;
            case 'system':
                echo json_encode(testSystemRequirements(), JSON_PRETTY_PRINT);
                break;
            default:
                echo json_encode(['error' => 'Unknown action'], JSON_PRETTY_PRINT);
        }
    } else {
        // Показати HTML інтерфейс
        ?>
        <!DOCTYPE html>
        <html lang="uk">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>MiaxiaLip - Тестування системи</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; background: #f5f5f5; }
                .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
                .header { text-align: center; color: #d4af37; margin-bottom: 30px; }
                .test-section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 5px; }
                .success { background: #d4edda; border-color: #c3e6cb; color: #155724; }
                .error { background: #f8d7da; border-color: #f5c6cb; color: #721c24; }
                .warning { background: #fff3cd; border-color: #ffeaa7; color: #856404; }
                button { background: #d4af37; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin: 5px; }
                button:hover { background: #b8941f; }
                .result { margin-top: 10px; padding: 10px; background: #f8f9fa; border-radius: 3px; white-space: pre-wrap; }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1>🔮 MiaxiaLip - Тестування системи</h1>
                    <p>Перевірка роботи всіх компонентів сайту</p>
                </div>
                
                <div class="test-section">
                    <h3>🧪 Тести системи</h3>
                    <button onclick="runTest('test')">Повний тест</button>
                    <button onclick="runTest('system')">Системні вимоги</button>
                    <button onclick="runTest('telegram')">Тест Telegram</button>
                    <div id="result" class="result" style="display: none;"></div>
                </div>
                
                <div class="test-section">
                    <h3>📋 Інструкції</h3>
                    <ul>
                        <li><strong>Повний тест</strong> - перевіряє всі компоненти системи</li>
                        <li><strong>Системні вимоги</strong> - перевіряє налаштування сервера</li>
                        <li><strong>Тест Telegram</strong> - відправляє тестове повідомлення</li>
                    </ul>
                </div>
            </div>
            
            <script>
                async function runTest(action) {
                    const resultDiv = document.getElementById('result');
                    resultDiv.style.display = 'block';
                    resultDiv.textContent = 'Виконання тесту...';
                    resultDiv.className = 'result warning';
                    
                    try {
                        const response = await fetch(`test.php?action=${action}`);
                        const data = await response.json();
                        
                        resultDiv.textContent = JSON.stringify(data, null, 2);
                        resultDiv.className = 'result ' + (data.success !== false ? 'success' : 'error');
                    } catch (error) {
                        resultDiv.textContent = 'Помилка: ' + error.message;
                        resultDiv.className = 'result error';
                    }
                }
            </script>
        </body>
        </html>
        <?php
    }
} else {
    echo json_encode(['error' => 'Only GET requests allowed'], JSON_PRETTY_PRINT);
}
?>