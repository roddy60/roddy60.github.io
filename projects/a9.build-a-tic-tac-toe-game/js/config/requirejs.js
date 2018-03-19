if (!Number.isFinite) {
  throw new Error(
    'Number.isFinite is required by application but is not available'
  );
}

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
        'js-utils': '../../../js/util',
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
