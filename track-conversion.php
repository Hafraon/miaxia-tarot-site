<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        
        $logEntry = [
            'timestamp' => date('c'),
            'value' => $input['value'] ?? 0,
            'service' => $input['service'] ?? 'unknown',
            'currency' => $input['currency'] ?? 'UAH',
            'source' => 'client-side',
            'user_agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'unknown'
        ];
        
        // Логування (опціонально)
        error_log('Conversion tracked: ' . json_encode($logEntry));
        
        http_response_code(200);
        echo json_encode(['success' => true, 'tracked' => true]);
        
    } catch (Exception $e) {
        http_response_code(500);
        echo json_encode(['success' => false, 'error' => 'Server error']);
    }
} else {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Method not allowed']);
}
?>