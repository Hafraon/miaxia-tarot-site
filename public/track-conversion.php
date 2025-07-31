<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit(0);
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['success' => false, 'error' => 'Only POST requests allowed']);
    exit;
}

try {
    // Get JSON data
    $input = json_decode(file_get_contents('php://input'), true);

    if (!$input) {
        http_response_code(400);
        echo json_encode(['success' => false, 'error' => 'No data received']);
        exit;
    }

    // Extract conversion data safely
    $value = isset($input['value']) ? floatval($input['value']) : 0;
    $service = isset($input['service']) ? htmlspecialchars($input['service']) : 'Unknown';
    $timestamp = isset($input['timestamp']) ? htmlspecialchars($input['timestamp']) : date('c');
    $userAgent = isset($input['userAgent']) ? htmlspecialchars($input['userAgent']) : '';
    $referrer = isset($input['referrer']) ? htmlspecialchars($input['referrer']) : '';
    $adBlockerDetected = isset($input['adBlockerDetected']) ? (bool)$input['adBlockerDetected'] : false;

    // Create log entry
    $logEntry = [
        'timestamp' => $timestamp,
        'value' => $value,
        'service' => $service,
        'adBlockerDetected' => $adBlockerDetected,
        'userAgent' => $userAgent,
        'referrer' => $referrer,
        'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
        'source' => 'server-side-tracking'
    ];

    // Save to log file with error handling
    $logFile = 'conversion-tracking.log';
    $logSuccess = file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);

    if ($logSuccess === false) {
        error_log("Failed to write to conversion log file: " . $logFile);
    }

    // Success response
    http_response_code(200);
    echo json_encode([
        'success' => true, 
        'message' => 'Conversion tracked successfully',
        'value' => $value,
        'service' => $service,
        'adBlockerDetected' => $adBlockerDetected,
        'logged' => $logSuccess !== false
    ]);

} catch (Exception $e) {
    // Error handling
    error_log("Conversion tracking error: " . $e->getMessage());
    
    http_response_code(500);
    echo json_encode([
        'success' => false, 
        'error' => 'Internal server error',
        'message' => 'Conversion tracking failed'
    ]);
}
?>