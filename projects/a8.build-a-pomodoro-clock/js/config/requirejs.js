(
  function () {
    if (!scripts_loaded().some(is_polyfill)) {
      throw new Error('Polyfill script not loaded');
    }

    function is_polyfill(script) {
      var prefix1 = 'https://cdn.jsdelivr.net/';
      var prefix2 =
        document.location.protocol +
        '//' +
        document.location.host +
        '/';

      var match_succeeded =
        Boolean(script.src.match(/\/polyfill\.min\.js$/));
      var search1_succeeded = script.src.indexOf(prefix1) === 0;
      var search2_succeeded = script.src.indexOf(prefix2) === 0;

      return match_succeeded && (search1_succeeded || search2_succeeded);
    }

    function scripts_loaded() {
      return ([]).slice.call(document.scripts);
    }
  }
).call();
/*<
  At time of writing, this polyfill is needed because IE11 is a supported
  browser, and that browser lacks Number.isFinite.

  It would be better to configure RequireJS to load the polyfill before
  running the application -- but there seems to be no way to do that.
*/

/*>
  Don't remove "var".  On 2018-01-23, <http://requirejs.org/docs/api.html>
  says:

    It is best to use var require = {} and do not use window.require = {},
    it will not behave correctly in IE.
*/
var require = (
  function () {
    var cur_time_ms = (new Date).getTime();

    var config = {
      baseUrl:
        document.location.pathname.replace(/[^/]+$/, '') + 'js',
      /*
        The call to the 'replace' method is done in case the URL contains
        "/index.xhtml".
      */

      enforceDefine: true,

      map: {},

      paths: {
        jquery:
          'https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min',
        'jquery-private': '../../../js/jquery-private',
        'vendor/sprintf-js':
           'https://cdn.jsdelivr.net/npm/sprintf-js@1.1.1/dist/sprintf.min',
      },
    };

    //> This condition should be true in development mode only
    if (document.location.hostname === 'localhost') {
      config.urlArgs = function (ID, URL) {
        var add_cache_buster =
          ID !== 'jquery' &&
          !ID.match(/^vendor\/./) &&
          URL.indexOf('https://cdn.jsdelivr.net/') === -1;

        return (
          add_cache_buster?
          separator_char(URL) + 't=' + cur_time_ms:
          ''
        );

        function separator_char(URL) {
          return URL.indexOf('?') === -1? '?': '&';
        }
      };
    }

    return config;
  }
)();
