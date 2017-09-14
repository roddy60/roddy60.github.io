<?php
/*
  The master version is the version on the production server.
*/
const URL =
  'http://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=xml';
const TIMEOUT = 10;

ini_set('display_errors', FALSE);

libxml_use_internal_errors(TRUE);

$callback = NULL;

if (array_key_exists('callback', $_GET) &&
  preg_match('@\A[A-Za-z_][A-Za-z_0-9]{0,70}\z@', $_GET['callback']) === 1)
{
  $callback = $_GET['callback'];
}

if (1) {
  if (PHP_SAPI === 'cli') {
    $callback = 'f';
  }
}

if ($callback === NULL) {
  perish('Fatal error: a valid callback was not specified');
} else {
  $curl = curl_init();

  curl_setopt_array(
    $curl,
    [
      CURLOPT_URL => URL,
      CURLOPT_HEADER => FALSE,
      CURLOPT_RETURNTRANSFER => TRUE,
      CURLOPT_TIMEOUT => TIMEOUT,
    ]
  );

  $curl_result = curl_exec($curl);

  if ($curl_result === NULL) {
    perish(
      'Fatal error: HTTP request to remote server failed or timed out',
      500
    );
  } else {
    register_shutdown_function(
      function () use ($curl_result) {
	add_debugging_info_to_response($curl_result);
      }
    );

    if (!is_valid_UTF8($curl_result)) {
      perish(
	'Fatal error: Unknown character set encoding ' .
	  'for XML document: not UTF-8',
	500
      );
    } else {
      $doc = new DomDocument;

      if (!$doc->loadXml($curl_result)) {
	perish(
	  'Fatal error: ' .
	    'Cannot create DomDocument object from XML document',
	  500
	);
      } else {
	$quote_text = trim(
	  $doc->getElementsByTagName('quoteText')->item(0)->textContent
	);
	$quote_author = trim(
	  $doc->getElementsByTagName('quoteAuthor')->item(0)->textContent
	);
	$quote_URL =
	  $doc->getElementsByTagName('quoteLink')->item(0)->textContent;
	$response_object = (object) [
	  'quoteText' => $quote_text,
	  'quoteAuthor' => $quote_author,
	  'quoteLink' => $quote_URL,
	];
	header('Content-Type: application/javascript');
	printf(
	  "%s(%s)",
	  $callback,
	  json_encode(
	    $response_object,
	    JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE
	  )
	);
      }
    }
  }
}

function add_debugging_info_to_response($response_to_us) {
  $code = http_response_code();
  if ($code >= 400 && $code <= 599) {
    echo "\nDEBUGGING\n\n";
    echo "The body of the HTTP response was:\n\n";
    var_dump($response_to_us);
  }
}

function is_valid_UTF8($s) {
  return is_string(iconv('UTF-8', 'UTF-32', $s));
}

function perish($error_message, $status_code = 404) {
  header('Content-Type: text/plain; charset=UTF-8', TRUE, $status_code);
  echo $error_message;
  if (preg_match('@\n\z@', $error_message) !== 1) {
    echo "\n";
  }
  exit(1);
}

# vim: set syntax=php:
