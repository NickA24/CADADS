<?php

$ch = curl_init();

curl_setopt($ch, CURLOPT_URL, "http://0.0.0.0:8080/");
curl_setopt($ch, CURLOPT_HEADER, 0);

curl_exec($ch);

curl_close($ch);

?>
