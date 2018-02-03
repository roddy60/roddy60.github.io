<?php
/*
  This program is used during development, as a wrapper for index.xhtml.
  Its purpose is to defeat the browser's caching of certain CSS and
  JavaScript files.
*/

const NO_CACHE_BUST_CLASS = 'no-cache-bust';
const XHTML_FILE = __DIR__ . '/index.xhtml';

libxml_use_internal_errors(TRUE);

$doc = new DomDocument;

if (!$doc->load(XHTML_FILE)) {
  header('Content-Type: text/plain;charset=UTF-8');
  echo 'Fatal error: ill-formed XML in file ', basename($XHTML_file), "\n";
} else {
  change_URLs($doc, 'link', 'href');
  change_URLs($doc, 'script', 'src');

  header('Content-Type: application/xhtml+xml');
  echo $doc->saveXml();
}

function cache_busting_disallowed(DomElement $element) {
  for ($e = $element; $e instanceof DomElement; $e = $e->parentNode) {
    if (element_disallows_cache_busting($e)) {
      return TRUE;
    }
  }

  return FALSE;
}

function change_URLs(DomDocument $doc, $element_name, $attribute_name) {
  static $time;

  if ($time === NULL) {
    $time = sprintf('%.16f', microtime(TRUE));
  }

  foreach ($doc->getElementsByTagName($element_name) as $elem) {
    if (eligible($elem, $attribute_name)) {
      $attrib_val = $elem->getAttribute($attribute_name);

      $separator_char = is_integer(strpos($attrib_val, '?'))? '&': '?';
      $new_attrib_val = $attrib_val . $separator_char . $time;

      $elem->setAttribute($attribute_name, $new_attrib_val);
    }
  }
}

function element_disallows_cache_busting(DomElement $element) {
  $regex = '@(\A|\s)' . preg_quote(NO_CACHE_BUST_CLASS) . '(\s|\z)@';
  return
    $element->hasAttribute('class') &&
    preg_match(
      $regex,
      $element->getAttribute('class')
    ) === 1;
}

function eligible(DomElement $element, $attribute_name) {
  return
    $element->hasAttribute($attribute_name) &&
    $element->getAttribute($attribute_name) !== '' &&
    !cache_busting_disallowed($element);
}
