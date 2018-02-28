define(
  function (require) {
    var global = require('global');

    return Object.freeze(
      {
        console:
          global.console ||
          {
            assert: noop,
            error: noop,
            info: noop,
            log: noop,
            time: noop,
            timeEnd: noop,
            trace: noop,
            warn: noop,
          },
      }
    );

    function noop() {}
  }
);
