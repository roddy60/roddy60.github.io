define(
  function (require) {
    var global = require('global');

    return Object.freeze(
      {
        console:
          global.console ||
          {
            error: noop,
            info: noop,
            log: noop,
            trace: noop,
            warn: noop,
          },
      }
    );

    function noop() {}
  }
);

