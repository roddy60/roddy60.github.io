(
  function () {
    var cur_time_ms = (new Date).getTime();

    var config = {
      baseUrl:
        document.location.pathname.replace(/[^/]+$/, '') + 'js',
      /*
        We do the replace in case the URL contains "/index.xhtml".
      */

      enforceDefine: true,

      map: {},

      paths: {
        'config/test/config': [
          'config/test/config',
          'config/test/config.fallback',
        ],
        'jquery': '../../../vendor/jquery-3.2.1.min',
        'jquery-private': '../../../js/jquery-private',
        'util': '../../../js/util',
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

    if (0) {
      var o = config.map['*'];

      o['MediawikiActionApi'] = 'MediawikiActionApi.stub';
    }

    requirejs.config(config);
  }
)();
