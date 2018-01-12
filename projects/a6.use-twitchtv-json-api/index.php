<?php
/*
  This program is used during development, as a wrapper for index.xhtml.
  Its purpose is to defeat the browser's caching of certain CSS and
  JavaScript files.
*/
$XHTML_file = __DIR__ . '/index.xhtml';
$doc = new DomDocument;
libxml_use_internal_errors(TRUE);
if ($doc->load($XHTML_file)) {
  $now = microtime(TRUE);

  $xp = new DomXPath($doc);
  $xp->registerNamespace('xh', 'http://www.w3.org/1999/xhtml');

  $XPath_expr = '//xh:link[contains(@href, "/twitch-streamers.css")]';
  $list = $xp->query($XPath_expr);
  if ($list->length >= 1) {
    $elem = $list->item(0);
    if ($elem->hasAttribute('href')) {
      $elem->setAttribute(
        'href',
        $elem->getAttribute('href') . '?t=' . $now
      );
    }
  }

  $XPath_expr = '//xh:body//xh:script';
  foreach ($xp->query($XPath_expr) as $elem) {
    if ($elem->hasAttribute('src')) {
      $cur_src = $elem->getAttribute('src');
      if (preg_match('@/vendor/.@', $cur_src) === 0) {
        $elem->setAttribute(
          'src',
          $cur_src . '?t=' . $now
        );
      }
    }
  }

  header('Content-Type: application/xhtml+xml');
  echo $doc->saveXml();
} else {
  header('Content-Type: text/plain;charset=UTF-8');
  echo 'Fatal error: ', basename($XHTML_file), " is ill-formed\n";
}
