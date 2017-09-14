/*
  This class relies on a local file called definitions.xml.  Here is how to
  produce that file:

    * Obtain the Debian 'fortune' package here:

      https://packages.debian.org/jessie/fortunes

    * From the package, extract the following file:

      /usr/share/games/fortunes/definitions

    * Wrap the contents in a CDATA section and a 'fortunes' root element,
    then add an XML declaration.

    * Hand-edit the file to remove some Control-H and associated characters.
*/
define(
  [
    'classes/Quote',
    'constants',
  ],
  function (Quote, constants) {
    var Class = function () {};

    Class.prototype.fetchQuote = function () {
      return $.ajax(
        {
          url: 'definitions.xml',
          timeout: constants.AJAX_TIMEOUT,
        }
      ).then(
        function (XML) {
          var fortunes = text_to_fortunes($(XML).text());
          var short_fortunes = fortunes.filter(is_short_fortune);
          var fortune = random_element(
            short_fortunes.length? short_fortunes: fortunes
          );
          if (0) {
            fortune = fortunes[0];
          }
          return new Quote(fortune, fortune);
        }
      );

      function is_short_fortune(fortune) {
        var letters = fortune.replace(/[^A-Za-z]/g, '');
        return letters.length <= 6 * 30;
      }

      function random_element(a) {
        return a[Math.floor(a.length * Math.random())];
      }

      function text_to_fortunes(text) {
        var tmp = text.split("\n%\n");
        tmp.pop();
        return tmp.map(function (s) { return s + "\n"; });
      }
    };

    return Class;
  }
);
