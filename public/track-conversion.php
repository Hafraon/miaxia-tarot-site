<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    exit(0);
}

// Only handle POST requests
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    echo json_encode(['success' => false, 'error' => 'Only POST requests allowed']);
    exit;
}

// Get JSON data
$input = json_decode(file_get_contents('php://input'), true);

if (!$input) {
    echo json_encode(['success' => false, 'error' => 'No data received']);
    exit;
}

// Extract conversion data
$value = isset($input['value']) ? floatval($input['value']) : 0;
$service = isset($input['service']) ? $input['service'] : 'Unknown';
$timestamp = isset($input['timestamp']) ? $input['timestamp'] : date('c');
$userAgent = isset($input['userAgent']) ? $input['userAgent'] : '';
$referrer = isset($input['referrer']) ? $input['referrer'] : '';
$adBlockerDetected = isset($input['adBlockerDetected']) ? $input['adBlockerDetected'] : false;

// Log conversion data
$logEntry = [
    'timestamp' => $timestamp,
    'value' => $value,
    'service' => $service,
    'adBlockerDetected' => $adBlockerDetected,
    'userAgent' => $userAgent,
    'referrer' => $referrer,
    'ip' => $_SERVER['REMOTE_ADDR'] ?? 'unknown',
    'source' => 'server-side-fallback'
];

// Save to log file
$logFile = 'conversion-tracking.log';
file_put_contents($logFile, json_encode($logEntry) . "\n", FILE_APPEND | LOCK_EX);

// Optional: Send to external analytics service
// curl_request_to_external_service($logEntry);

// Response
echo json_encode([
    'success' => true, 
    'message' => 'Conversion tracked server-side',
    'value' => $value,
    'service' => $service,
    'adBlockerDetected' => $adBlockerDetected
]);

// Function to send data to external service (if needed)
function curl_request_to_external_service($data) {
    // Example: send to your analytics service
    // $url = 'https://your-analytics-service.com/track';
    // $ch = curl_init();
    // curl_setopt($ch, CURLOPT_URL, $url);
    // curl_setopt($ch, CURLOPT_POST, 1);
    // curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));
    // curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/json']);
    // curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    // $result = curl_exec($ch);
    // curl_close($ch);
    // return $result;
}
?>