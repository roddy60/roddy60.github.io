requirejs.config(
  {
    baseUrl:
      document.location.pathname.replace(/[^/]+$/, '') + 'js'
    /*
      We do the replace in case the URL contains "/index.xhtml".
    */
  }
);

require(
  ['classes/App'],
  function (App) {
    $(
      function () {
        (new App).start();
      }
    );
  }
);
