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
        'jquery':
          'https://cdn.jsdelivr.net/npm/jquery@3.3.1/dist/jquery.min',
        'jquery-private': '../../../js/jquery-private',
        'bowser':
          'https://cdn.jsdelivr.net/npm/bowser@1.9.1/bowser.min',
        /*<
          The above file uses the name "bowser" when calling the AMD
          'define' function, so we have to use that name here too.
        */
      },
    };

    //> This condition should be true in development mode only
    if (document.location.hostname === 'localhost') {
      config.urlArgs = function (ID, URL) {
        if (ID.match(/^vendor\/./) || ID === 'jquery') {
          var result = '';
        } else {
          var result = separator_char(URL) + 't=' + cur_time_ms;
        }

        return result;

        function separator_char(URL) {
          return URL.indexOf('?') === -1? '?': '&';
        }
      };
    }

    return config;
  }
)();
