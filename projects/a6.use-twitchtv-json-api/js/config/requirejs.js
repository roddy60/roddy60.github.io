(
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
        'config/config': [
          'config/config',
          'config/config.fallback',
        ],
        'config/test/config': [
          'config/test/config',
          'config/test/config.fallback',
        ],
        'jquery': '../../../vendor/jquery-3.2.1.min',
        'jquery-private': '../../../js/jquery-private',
        'vendor/lodash': '../../../vendor/lodash/lodash-4.7.14.min',
        'vendor/mout': '../../../vendor/mout/1.1.0/mout-1.1.0/src',
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

        if (0) {
          console.log(1011, ID, URL, result);
        }

        return result;

        function separator_char(URL) {
          return URL.indexOf('?') === -1? '?': '&';
        }
      };
    }

    requirejs.config(config);
  }
)();
