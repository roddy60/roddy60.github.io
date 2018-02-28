require(
  ['jquery-private', 'App'],
  function ($, App) {
    $(
      function () {
        (new App).start();
      }
    )
  }
);
