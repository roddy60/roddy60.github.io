define(
  [
    'classes/Quote',
    'constants',
    'lib/wordwrap',
  ],
  function (Quote, constants, wordwrap) {
    var Class = function () {};

    Class.prototype.fetchQuote = function () {
      return $.ajax(
        {
          url: URL(),
          dataType: 'jsonp',
          timeout: constants.AJAX_TIMEOUT,
        }
      ).then(format_quotes);

      function URL() {
        return constants.FORISMATIC_PROXY_URL;
        /*<
          This is essentially a proxy for
          <http://api.forismatic.com/api/1.0/>.

          Why use a proxy?  Mainly because this app will be hosted on HTTPS,
          which means that Chrome, and perhaps other browsers, won't allow
          <http://api.forismatic.com/api/1.0/> to be accessed, due to
          mixed-content rules.

          The API at <http://api.forismatic.com/api/1.0/> is documented
          here:

            http://forismatic.com/en/api/
        */
        return result;
      }

      function format_quotes(data) {
        return new Quote(formatted(data), tweetified(data));
      }

      function formatted(data) {
        var result = wordwrap(data.quoteText, 60).trim();

        if (result.length) {
          result += "\n";
        }

        var have_author = /\S/.test(data.quoteAuthor);
        /*<
          Some quotes have no author; for example:

            http://forismatic.com/en/bde7da00b3/
        */

        if (have_author) {
          var attribution = ' '.repeat(2) + '-- ' + data.quoteAuthor;

          var max_line_len = Math.max.apply(
            null,
            result.split("\n").map(function (s) { return s.length; })
          );

          if (max_line_len > attribution.length) {
            var diff = max_line_len - attribution.length;
            attribution = ' '.repeat(diff) + attribution;
          }

          result += "\n" + attribution + "\n";
        }

        return result;
      }

      function tweetified(data) {
        var result = '“' + data.quoteText + '”';
        if (/\S/.test(data.quoteAuthor)) {
          result += ' -- ' + data.quoteAuthor;
        }
        return result;
      }
    };

    return Class;
  }
);
