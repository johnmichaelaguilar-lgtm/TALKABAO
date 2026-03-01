<?php
header('Content-Type: application/json');

// Get input
$input = json_decode(file_get_contents('php://input'), true);
$text = $input['text'] ?? '';
$target = $input['target'] ?? 'es';

if (!$text) {
    echo json_encode(['error' => 'No text provided']);
    exit;
}

// FreeAPITools API
$apiKey = "freeapi_222328d7-e9f";
$apiUrl = "https://freeapitools.dev/api/v1/translate";

$data = [
    "text" => $text,
    "target" => $target,
    "source" => "en"
];

$ch = curl_init($apiUrl);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "X-API-Key: $apiKey"
]);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($data));

$response = curl_exec($ch);
$httpcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($httpcode !== 200) {
    echo json_encode(['error' => 'API request failed', 'code' => $httpcode]);
} else {
    echo $response;
}
?>