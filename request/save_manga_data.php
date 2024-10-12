<?php
header("Access-Control-Allow-Origin: *");

// Get the JSON data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

// Save the data to manga_list.json
file_put_contents('../list/manga_list.json', $data['data']);

// Send a response back to the client
http_response_code(200);