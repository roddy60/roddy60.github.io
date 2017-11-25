requirejs.config(
  {
    baseUrl:
      document.location.pathname.replace(/[^/]+$/, '') + 'js',
    /*
      We do the replace in case the URL contains "/index.xhtml".
    */

    paths: {
      'vendor/mout': '../../../vendor/mout/1.1.0/mout-1.1.0/src',
    },
  }
);

require(
  ['globals/jquery', 'classes/App'],
  function ($, App) {
    $(
      function () {
        (new App).start(); 
      }
    );
  }
);
