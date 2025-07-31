<?php
// Безпечний обробник помилок для MiaxiaLip сайту

// Функція для безпечного логування помилок
function safe_error_log($message, $type = 'ERROR') {
    $log_file = 'site_errors.log';
    $timestamp = date('Y-m-d H:i:s');
    $log_entry = "[$timestamp] [$type] $message" . PHP_EOL;
    
    error_log($log_entry, 3, $log_file);
}

// Обробник PHP помилок
function custom_error_handler($errno, $errstr, $errfile, $errline) {
    // Не логувати незначні попередження
    if (!(error_reporting() & $errno)) {
        return false;
    }
    
    $error_types = [
        E_ERROR => 'FATAL ERROR',
        E_WARNING => 'WARNING',
        E_PARSE => 'PARSE ERROR',
        E_NOTICE => 'NOTICE',
        E_CORE_ERROR => 'CORE ERROR',
        E_CORE_WARNING => 'CORE WARNING',
        E_USER_ERROR => 'USER ERROR',
        E_USER_WARNING => 'USER WARNING',
        E_USER_NOTICE => 'USER NOTICE'
    ];
    
    $error_type = $error_types[$errno] ?? 'UNKNOWN ERROR';
    $message = "$error_type: $errstr in $errfile on line $errline";
    
    safe_error_log($message);
    
    // Для фатальних помилок показуємо дружнє повідомлення
    if ($errno == E_ERROR || $errno == E_CORE_ERROR || $errno == E_USER_ERROR) {
        http_response_code(500);
        echo json_encode([
            'success' => false,
            'error' => 'Internal server error',
            'message' => 'Something went wrong. Please try again later.'
        ]);
        exit();
    }
    
    return true;
}

// Обробник неперехоплених винятків
function custom_exception_handler($exception) {
    $message = "UNCAUGHT EXCEPTION: " . $exception->getMessage() . 
               " in " . $exception->getFile() . 
               " on line " . $exception->getLine();
    
    safe_error_log($message);
    
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Internal server error',
        'message' => 'An unexpected error occurred.'
    ]);
    exit();
}

// Обробник фатальних помилок
function custom_shutdown_handler() {
    $error = error_get_last();
    
    if ($error && in_array($error['type'], [E_ERROR, E_CORE_ERROR, E_COMPILE_ERROR, E_PARSE])) {
        $message = "FATAL ERROR: {$error['message']} in {$error['file']} on line {$error['line']}";
        safe_error_log($message);
        
        // Якщо це AJAX запит, повертаємо JSON
        if (!empty($_SERVER['HTTP_X_REQUESTED_WITH']) && 
            strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest') {
            
            header('Content-Type: application/json');
            http_response_code(500);
            echo json_encode([
                'success' => false,
                'error' => 'Server error',
                'message' => 'The server encountered an error processing your request.'
            ]);
        }
    }
}

// Функція для перевірки системних вимог
function check_system_requirements() {
    $requirements = [
        'PHP version >= 7.0' => version_compare(PHP_VERSION, '7.0.0', '>='),
        'cURL extension' => extension_loaded('curl'),
        'JSON extension' => extension_loaded('json'),
        'Write permissions' => is_writable('./')
    ];
    
    $failed = [];
    foreach ($requirements as $requirement => $met) {
        if (!$met) {
            $failed[] = $requirement;
        }
    }
    
    if (!empty($failed)) {
        safe_error_log("System requirements not met: " . implode(', ', $failed));
        return false;
    }
    
    return true;
}

// Активувати обробники помилок
set_error_handler('custom_error_handler');
set_exception_handler('custom_exception_handler');
register_shutdown_function('custom_shutdown_handler');

// Налаштування для продакшину
if (!defined('DEVELOPMENT_MODE')) {
    ini_set('display_errors', 0);
    ini_set('display_startup_errors', 0);
    error_reporting(E_ALL & ~E_NOTICE & ~E_STRICT & ~E_DEPRECATED);
} else {
    ini_set('display_errors', 1);
    ini_set('display_startup_errors', 1);
    error_reporting(E_ALL);
}

// Перевірка системи при підключенні
if (!check_system_requirements()) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'System requirements not met',
        'message' => 'Server configuration error. Please contact administrator.'
    ]);
    exit();
}
?>